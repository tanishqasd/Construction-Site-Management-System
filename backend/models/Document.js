const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ['Drawing', 'Contract', 'Permit', 'Report', 'Certificate'], default: 'Drawing' },
  url: { type: String, required: function() { return !this.attachment; }, validate: { validator: (value) => { if (!value) return true; try { const url=new URL(value);return ['http:','https:'].includes(url.protocol)&&!url.username&&!url.password; } catch { return false; } }, message: 'Use a valid HTTP(S) document URL without credentials' } },
  attachment: { type: String, validate: { validator: (value) => !value || /^data:(application\/pdf|image\/png|image\/jpeg);base64,[A-Za-z0-9+/=]+$/.test(value) && Buffer.from(value.split(',')[1], 'base64').length <= 2 * 1024 * 1024, message: 'Upload a PDF, PNG or JPEG up to 2 MB' } },
  fileName: { type: String, trim: true, maxlength: 200 },
  revision: { type: String, default: 'R0', trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
module.exports = mongoose.model('Document', schema);
