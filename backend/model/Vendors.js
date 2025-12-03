const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
    {
        brand_name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            unique: true,
        },
        brand_image: {
            type: String, // URL
            required: true,
        },
        brand_cover_image: {
            type: String, // URL
        },
        brand_description: {
            type: String,
        },
        instagram: {
            type: String,
        },
        facebook: {
            type: String,
        },
        x: {
            type: String, // formerly Twitter
        },
        phone_number: {
            type: String,
        },
        plan: {
            type: String,
            enum: ["free", "basic", "pro"],
            default: "basic",
        },
        status: {
            type: String,
            enum: ["active", "inactive", "pending"],
            default: "active",
        }
    },
    { timestamps: true }
);

// Pre-save hook to generate username
vendorSchema.pre("save", function(next) {
    if (!this.username) {
        const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
        this.username = this.brand_name.toLowerCase().replace(/\s+/g, '') + "_" + randomNum;
    }
    next();
});

module.exports = mongoose.model("Vendor", vendorSchema);
