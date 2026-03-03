const express = require('express')
const Vendor = require('../model/Vendors')
const responseData = require('../middleware/response')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require("dotenv").config();


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return responseData(res, 'error', 400, 'Email and password are required', [], '');
        }

        const vendor = await Vendor.findOne({ brand_email: email });

        if (!vendor) {
            return responseData(res, 'error', 401, 'Invalid email or password', [], '');
        }

        const isMatch = await bcrypt.compare(password, vendor.password);

        if (!isMatch) {
            return responseData(res, 'error', 401, 'Invalid email or password', [], '');
        }

        const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,           // JS cannot access it
            secure: true,             // only over HTTPS
            sameSite: "None",         // needed if frontend is on a different domain (Vercel)
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        console.log(token)
        // ✅ Return vendor info (without token)
        return responseData(res, 'success', 200, 'Login successful', [], '');

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    login
}