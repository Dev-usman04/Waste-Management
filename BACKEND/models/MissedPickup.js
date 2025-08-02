const mongoose = require('mongoose');

const missedPickupSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pickupId: { type: mongoose.Schema.Types.ObjectId, ref: 'PickupRequest', required: true },
  reason: { type: String, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Reviewed', 'Resolved'] },
  adminComment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MissedPickup', missedPickupSchema); 