// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        images: {
            type: [String], // array of image URLs
            validate: [arrayLimit, "{PATH} exceeds the limit of 6"], // max 6 images
        },
    },
    { timestamps: true } // automatically adds createdAt & updatedAt
);

// Custom validator to limit images array to 6
function arrayLimit(val) {
    return val.length <= 6;
}

module.exports = mongoose.model("Product", productSchema);
