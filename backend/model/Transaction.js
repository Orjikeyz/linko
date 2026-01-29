const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    vendor_id: {
      type: String, // or Number if your vendor IDs are numeric
      required: true,
      index: true,
    },

    reference_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      default: "pending",
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },
    method: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
