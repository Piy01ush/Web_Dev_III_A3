// Step -1 import module
const mongoose = require("mongoose");

// Step -2 Making structure
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    supplier: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Step -3 Making Model
const productModel = mongoose.model("product", productSchema);

// Step -4 Export Model
module.exports = { productModel };