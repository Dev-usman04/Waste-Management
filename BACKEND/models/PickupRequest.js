const mongoose = require('mongoose');

const pickupRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
  address: { type: String, required: true },
  pickupType: { type: String, required: true, enum: ['Recyclable', 'Organic', 'Hazardous'] },
  dateTime: { type: Date, required: true },
  image: { type: String },
  status: { type: String, default: 'Pending', enum: ['Pending', 'In Progress', 'Collected'] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PickupRequest', pickupRequestSchema);