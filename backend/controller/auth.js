const express = require('express')
const Vendor = require('../model/Vendors')
const responseData = require('../middleware/response')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

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

        const token = jwt.sign({ id: vendor._id, userId: vendor.username, status: vendor.status}, process.env.JWT_SECRET, { expiresIn: "1h", algorithm: 'HS256' });

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

const register = async (req, res) => {
    try {
        const { brandName, email, password } = req.body;

        // 1. Validate input
        if (!brandName || !email || !password) {
            return responseData(res, 'error', 400, 'All fields are required', [], '');
        }

        if (password.length < 6) {
            return responseData(res, 'error', 400, 'Password must be at least 6 characters', [], '');
        }

        function generateUsername(name) {
            const cleanName = name
                .toLowerCase()
                .replace(/\s+/g, "")        // remove spaces
                .replace(/[^a-z0-9]/g, "");  // remove special chars

            const randomBytes = crypto.randomInt(1000, 99999);

            return `${cleanName}_${randomBytes}`;
        }

        let username = generateUsername(brandName)

        // 2. Check if user already exists
        const existingVendor = await Vendor.findOne({
            $or: [
                { brand_email: email },
                { username: username }
            ]
        });
        

        if (existingVendor) {
            return responseData(res, 'error', 409, 'User already exists', [], '');
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        const codeToken = Math.floor(100000 + Math.random() * 900000).toString(); //generate random code token 

        // 4. Create user
        const newVendor = await Vendor.create({
            brand_name: brandName,
            username: username,
            brand_email: email.toLowerCase(),
            password: hashedPassword,
            token: codeToken
        });

        // 5. Create JWT (optional but common)
        const token = jwt.sign({ id: newVendor._id, userId: newVendor.username}, process.env.JWT_SECRET, { expiresIn: "1h", algorithm: 'HS256' });

        // 6. Set cookie (same as login)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,       // HTTPS only
            sameSite: "None",   // cross-site safe
            maxAge: 1000 * 60 * 60
        });

        try {

            const response = await fetch(`${process.env.PHP_URL}verification_code.php`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: email,
                    name: brandName,
                    code: codeToken,
                    link: `${process.env.FRONTEND_URL}accountVerification`
                })
            });

            return responseData(res, 'success', 201, 'Registration successful', { id: newVendor.username }, '');

        } catch (error) {
            return responseData(res, "error", 500, "An error occurred while processing your registration.", [], "");
        }

    } catch (error) {
        console.error(error);
        return responseData(res, "error", 500, "Sorry an error occurred while creating an account. Please try again later", [], "");
    }
};

const accountVerification = async (req, res) => {
    try {

        let { email, code } = req.body;

        // Validate input
        if (typeof email !== "string" || !code) {
            return responseData(res, "error", 400, "Invalid request.", [], "");
        }

        email = email.trim().toLowerCase();
        code = code.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return responseData(res, "error", 400, "Invalid email address.", [], "");
        }

        if (!/^\d{6}$/.test(code)) {
            return responseData(res, "error", 400, "Invalid verification code.", [], "");
        }

        const vendor = await Vendor.findOne({ brand_email: email });

        // Do not reveal whether the account exists
        if (!vendor) {
            return responseData(res, "error", 400, "Invalid verification code.", [], "");
        }

        if (vendor.status === "active") {
            return responseData(res, "error", 409, "Account has already been verified.", [], "");
        }

        if (vendor.token !== code) {
            return responseData(res, "error", 400, "Invalid verification code.", [], "");
        }

        const newToken = Math.floor(100000 + Math.random() * 900000).toString(); //generate random code token 

        await Vendor.findByIdAndUpdate(vendor._id, {status: "active",token: newToken}, {returnDocument: "after"});

        return responseData(res, "success", 200, "Account verified successfully.", [], "");

    } catch (err) {
        console.error(err);
        return responseData(res, "error", 500, "Error processing account verification.", [], "");
    }
};

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

        // if (!/[A-Z]/.test(newPassword)) {
        //     return responseData(res, 'error', 400, 'Must include at least one uppercase letter', [], '');
        // }

        // if (!/[a-z]/.test(newPassword)) {
        //     return responseData(res, 'error', 400, 'Must include at least one lowercase letter', [], '');
        // }

        // if (!/[0-9]/.test(newPassword)) {
        //     return responseData(res, 'error', 400, 'Must include at least one number', [], '');
        // }

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
    register,
    accountVerification,
    changePassword,
    logout
}