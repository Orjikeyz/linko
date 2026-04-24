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

        const token = jwt.sign({ id: vendor._id, userId: vendor.username }, process.env.JWT_SECRET, { expiresIn: "1h", algorithm: 'HS256' });

        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: false, // false on HTTP
        //     sameSite: "lax", // works for dev
        //     maxAge: 1000 * 60 * 60 // 1 hour in milliseconds
        // });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,        // ✅ MUST be true on HTTPS
            sameSite: "None",    // ✅ MUST be None for cross-origin
            maxAge: 1000 * 60 * 60
        });

        return responseData(res, 'success', 200, 'Login successful', { id: vendor.username }, '');

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return responseData(res, 'error', 400, 'All fields are required', [], '');
        }

        if (newPassword !== confirmPassword) {
            return responseData(res, 'error', 400, 'Passwords do not match', [], '');
        }

        if (newPassword.length < 6) {
            return responseData(res, 'error', 400, 'Password must be at least 6 characters', [], '');
        }

        if (!/[A-Z]/.test(newPassword)) {
            return responseData(res, 'error', 400, 'Must include at least one uppercase letter', [], '');
        }

        if (!/[a-z]/.test(newPassword)) {
            return responseData(res, 'error', 400, 'Must include at least one lowercase letter', [], '');
        }

        if (!/[0-9]/.test(newPassword)) {
            return responseData(res, 'error', 400, 'Must include at least one number', [], '');
        }

        const vendor = await Vendor.findOne({ username: req.userId }, { username: 1, password: 1});

        if (!vendor) {
            return responseData(res, 'error', 404, 'User not found', [], '');
        }

        const isMatch = await bcrypt.compare(currentPassword, vendor.password);

        if (!isMatch) {
            return responseData(res, 'error', 401, 'Current password is incorrect', [], '');
        }

        // Prevent reuse
        const isSame = await bcrypt.compare(newPassword, vendor.password);
        if (isSame) {
            return responseData(res, 'error', 400, 'New password must be different', [], '');
        }

        //Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        vendor.password = hashedPassword;
        await vendor.save();

        return responseData(res, 'success', 200, 'Password updated successfully', [], '');

    } catch (error) {
        console.error("Change password error:", error);
        return responseData(res, 'error', 500, 'Internal server error', [], '');
    }
};

const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
}



module.exports = {
    login,
    changePassword,
    logout
}