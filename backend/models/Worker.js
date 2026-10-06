const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', sparse: true, unique: true },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
    },

    skill: {
      type: String,
      enum: [
        "Mason",
        "Electrician",
        "Plumber",
        "Painter",
        "Carpenter",
        "Labour",
        "Supervisor",
        "Other",
      ],
      required: true,
    },

    dailyWage: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    joiningDate: {
      type: Date,
      default: Date.now,
    },

    emergencyContact: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedSite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Worker", workerSchema);
