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
        vendor_id: {
            type: String,      // Vendor.username
            required: true
        }
    },
    { timestamps: true } // automatically adds createdAt & updatedAt
);

// Custom validator to limit images array to 6
function arrayLimit(val) {
    return val.length <= 6;
}


// Virtual populate to link vendor
productSchema.virtual("vendor", {
    ref: "Vendor",
    localField: "vendor_id",   // field in Product
    foreignField: "username",  // field in Vendor
    justOne: true
});

// Include virtuals in JSON / Object outputs
productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
