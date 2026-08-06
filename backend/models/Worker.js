const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
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
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Worker", workerSchema);