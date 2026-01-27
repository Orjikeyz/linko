const express = require("express")
const responseData = require('../middleware/response')
require("dotenv").config();

const processPayment = async (req, res) => {
    try {
        // const { email, amount } = req.body;
        const email = "orjikeyz7@gmail.com"
        const amount = 3000
        const PAYSTACK_BASE_URL = "https://api.paystack.co";
        const secretKey = process.env.SECRET_KEY

        if (!email || !amount) {
            return res.status(400).json({ error: "Email and amount required" });
        }

        const response = await fetch(
            `${PAYSTACK_BASE_URL}/transaction/initialize`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    amount: amount * 100, // convert to kobo
                    callback_url: `${process.env.BASE_URL}/payment/callback`,
                }),
            }
        );

        const data = await response.json();

        if (!data.status) {
            return responseData(res, 'error', 400, 'Sorry an error occurred', [], '')
        }
        let paystackResponse = {
            authorization_url: data.data.authorization_url,
            reference: data.data.reference,
        }
        return responseData(res, 'success', 200, 'Data retrived successfully', paystackResponse, '')
    } catch (error) {
        return responseData(res, 'error', 400, `${error.message}`, [], '')
    }
}


const verifyPayment = async (req, res) => {
    try {
        const PAYSTACK_BASE_URL = "https://api.paystack.co";
        const secretKey = process.env.SECRET_KEY
        const reference = req.query.reference

        const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return responseData(res, 'error', 400, 'Sorry an error occurred', [], '')
        }

        if (data.data && data.data.status === "success") {
            // Save transaction to DB here
            console.log(data.data.amount / 100)
            return responseData(res, 'success', 200, 'Payment Verified', data.data, '')
        }

        res.status(400).json({ status: "failed", data });
    } catch (error) {
        return responseData(res, 'error', 400, `${error.message}`, [], '')
    }
}

module.exports = {
    processPayment,
    verifyPayment
}