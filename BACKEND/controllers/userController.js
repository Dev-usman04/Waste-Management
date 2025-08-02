const PickupRequest = require('../models/PickupRequest');
const Feedback = require('../models/Feedback');
const MissedPickup = require('../models/MissedPickup');
const cloudinary = require('cloudinary').v2;

exports.schedulePickup = async (req, res) => {
  const { address, pickupType, dateTime } = req.body;
  const userId = req.user.id;
  try {
    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const pickup = new PickupRequest({ userId, address, pickupType, dateTime, image: imageUrl });
    await pickup.save();
    res.status(201).json(pickup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPickupHistory = async (req, res) => {
  try {
    const pickups = await PickupRequest.find({ userId: req.user.id }).populate('workerId', 'name');
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitFeedback = async (req, res) => {
  const { pickupId, rating, comment } = req.body;
  try {
    const feedback = new Feedback({ userId: req.user.id, pickupId, rating, comment });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reportMissedPickup = async (req, res) => {
  const { pickupId, reason } = req.body;
  try {
    const missed = new MissedPickup({
      userId: req.user.id,
      pickupId,
      reason,
    });
    await missed.save();
    res.status(201).json(missed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};