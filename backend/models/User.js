const mongoose = require("mongoose");
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    assignedSites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Site' }],
    active: { type: Boolean, default: true },
    tokenVersion: { type: Number, default: 0, select: false },
    mustChangePassword: { type: Boolean, default: false },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: { validator: isEmail, message: 'Enter a valid email address.' },
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        "owner",
        "admin",
        "hr",
        "manager",
        "site_manager",
        "supervisor",
        "worker",
        "labour",
      ],
      default: "worker",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
