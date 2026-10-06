const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  companyName: { type: String, required: true, trim: true },
  contactName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  trade: { type: String, required: true, trim: true },
  crewSize: { type: Number, min: 0, default: 0 },
  status: { type: String, enum: ['Active', 'On hold', 'Completed'], default: 'Active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
module.exports = mongoose.model('Contractor', schema);
