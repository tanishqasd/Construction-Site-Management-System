const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    materialName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Cement",
        "Steel",
        "Bricks",
        "Sand",
        "Gravel",
        "Paint",
        "Electrical",
        "Plumbing",
        "Other",
      ],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      enum: ["Kg", "Ton", "Bag", "Piece", "Litre", "Cubic Meter"],
      required: true,
    },

    costPerUnit: {
      type: Number,
      required: true,
      min: 0,
    },

    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
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

module.exports = mongoose.model("Material", materialSchema);