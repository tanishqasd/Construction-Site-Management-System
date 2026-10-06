const mongoose = require('mongoose');
module.exports = mongoose.model('Report', new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  title: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['Daily progress', 'Safety inspection'], default: 'Daily progress' },
  summary: { type: String, required: true, trim: true },
  weather: { type: String, trim: true },
  hoursWorked: { type: Number, min: 0, max: 24, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true }));
