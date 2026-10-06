const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    managerName: { type: String, trim: true },
    siteName: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    budget: {
      type: Number,
      required: true,
      min: 0,
    },

    startDate: {
      type: Date,
      required: true,
    },

    expectedEndDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Planning", "Ongoing", "Completed"],
      default: "Planning",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Site", siteSchema);
