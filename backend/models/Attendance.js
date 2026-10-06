const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },

    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "Half Day"],
      default: "Present",
    },

    checkIn: {
      type: String,
    },
    shift: {
      type: String,
      enum: ['Morning', 'General', 'Night'],
      default: 'General',
    },
    notes: { type: String, trim: true },
    dailyRate: { type: Number, min: 0 },

    checkOut: {
      type: String,
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Keep historical records untouched while preventing duplicate new daily shifts.
attendanceSchema.index(
  { organizationId: 1, worker: 1, date: 1 },
  { unique: true, partialFilterExpression: { organizationId: { $exists: true } } }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
