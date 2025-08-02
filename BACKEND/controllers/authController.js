const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Worker = require('../models/Worker');
const Admin = require('../models/Admin');
const AdminToken = require('../models/AdminToken');

exports.registerUser = async (req, res) => {
  const { name, email, password, address } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password: await bcrypt.hash(password, 10), address });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerWorker = async (req, res) => {
  const { name, email, phone, password, token } = req.body;
  try {
    const adminToken = await AdminToken.findOne({ token, used: false });
    if (!adminToken) return res.status(400).json({ message: 'Invalid or used token' });

    let worker = await Worker.findOne({ email });
    if (worker) return res.status(400).json({ message: 'Worker already exists' });

    worker = new Worker({ name, email, phone, password: await bcrypt.hash(password, 10) });
    await worker.save();

    adminToken.used = true;
    await adminToken.save();

    const jwtToken = jwt.sign({ id: worker._id, role: worker.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token: jwtToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email }) || await Worker.findOne({ email }) || await Admin.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};