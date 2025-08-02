const AdminToken = require('../models/AdminToken');
const PickupRequest = require('../models/PickupRequest');
const User = require('../models/User');
const Worker = require('../models/Worker');
const Feedback = require('../models/Feedback');

exports.generateToken = async (req, res) => {
  try {
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    const adminToken = new AdminToken({ token });
    await adminToken.save();
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const workers = await Worker.countDocuments();
    const pickups = await PickupRequest.countDocuments();
    const pendingPickups = await PickupRequest.countDocuments({ status: 'Pending' });
    const feedback = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);

    res.json({ users, workers, pickups, pendingPickups, avgRating: feedback[0]?.avgRating || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignPickup = async (req, res) => {
  const { pickupId, workerId } = req.body;
  try {
    const pickup = await PickupRequest.findById(pickupId);
    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });

    pickup.workerId = workerId;
    await pickup.save();
    res.json(pickup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find();
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPickups = async (req, res) => {
  try {
    const pickups = await PickupRequest.find().populate('userId', 'name email').populate('workerId', 'name email');
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate('userId', 'name email').populate('pickupId', 'address');
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllMissedPickups = async (req, res) => {
  try {
    const missed = await require('../models/MissedPickup').find().populate('userId', 'name email').populate('pickupId', 'address dateTime');
    res.json(missed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMissedPickup = async (req, res) => {
  const { missedPickupId, status, comment } = req.body;
  try {
    const MissedPickup = require('../models/MissedPickup');
    const missed = await MissedPickup.findById(missedPickupId);
    if (!missed) return res.status(404).json({ message: 'Missed pickup not found' });
    missed.status = status;
    if (comment) missed.adminComment = comment;
    await missed.save();
    res.json(missed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    // Top workers by number of pickups
    const topWorkers = await PickupRequest.aggregate([
      { $match: { workerId: { $ne: null } } },
      { $group: { _id: '$workerId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'workers', localField: '_id', foreignField: '_id', as: 'worker' } },
      { $unwind: '$worker' },
      { $project: { _id: 0, name: '$worker.name', email: '$worker.email', count: 1 } }
    ]);
    // Popular zones by address frequency
    const popularZones = await PickupRequest.aggregate([
      { $group: { _id: '$address', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, address: '$_id', count: 1 } }
    ]);
    // Missed pickup counts
    const MissedPickup = require('../models/MissedPickup');
    const missedCounts = await MissedPickup.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json({ topWorkers, popularZones, missedCounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};