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

        const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, { expiresIn: "1h", algorithm: 'HS256' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // false on HTTP
            sameSite: "lax", // works for dev
            maxAge: 1000 * 60 * 60 // 1 hour in milliseconds
        });

        return responseData(res, 'success', 200, 'Login successful', { id: vendor.username }, '');

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
}
module.exports = {
    login,
    logout
}