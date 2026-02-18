const express = require("express")
const responseData = require('../middleware/response')
const Transaction = require("../model/Transaction")
require("dotenv").config();

const getTransaction = async (req, res) => {
    try {
        const vendor_id = req.query.id;
        const page = parseInt(req.query.page) || 1;     // current page
        const limit = parseInt(req.query.limit) || 10;  // items per page

        if (!vendor_id) {
            return responseData(res, 'error', 400, 'Vendor ID required', [], '');
        }

        const skip = (page - 1) * limit;

        // Get total count for pagination
        const total = await Transaction.countDocuments({ vendor_id });

        if (total === 0) {
            return responseData(res, 'error', 404, 'No transactions found', [], '');
        }


        // Fetch paginated data
        const transactions = await Transaction.find({ vendor_id })
            .sort({ createdAt: -1 }) // optional sorting
            .skip(skip)
            .limit(limit);


        return responseData(res, 'success', 200, 'Transactions fetched successfully', {
            data: transactions,
            currentPage: page,
            totalPages: console.log(),
            totalRecords: total
        }, '');

    } catch (error) {
        console.error(error);
        return responseData(res, 'error', 500, 'Internal server error', [], '');
    }
};



const processPayment = async (req, res) => {
    try {
        const email = "orjikeyz7@gmail.com"
        const amount = 3000
        const vendor_id = req.query.id
        const PAYSTACK_BASE_URL = "https://api.paystack.co";
        const secretKey = process.env.SECRET_KEY

        if (!email || !amount) {
            return res.status(400).json({ error: "Email and amount required" });
        }

        if (!vendor_id) {
            return responseData(res, 'error', 400, 'Vendor ID is required', [], '');
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
                    metadata: {
                        username: vendor_id
                    }
                }),
            }
        );

        if (!response.ok) {
            return responseData(res, 'error', 400, 'Payment initialization failed', [], '');
        }
        const data = await response.json();

        if (!data.status) {
            return responseData(res, 'error', 400, 'Paystack returned an error', [], '')
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
        const reference = req.query.reference;

        if (!reference) {
            return responseData(res, 'error', 400, 'Payment reference is required', [], '');
        }

        const response = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.SECRET_KEY}`,
                },
            }
        );

        if (!response.ok) {
            return responseData(res, 'error', 400, 'Failed to verify payment', [], '');
        }

        const data = await response.json();

        if (data.data?.status !== 'success') {
            return responseData(res, 'error', 400, data.data?.gateway_response, [], '');
        }

        // Check for duplicate transaction
        const existingTransaction = await Transaction.findOne({
            reference_id: data.data.reference
        });

        if (existingTransaction) {
            return responseData(res, 'success', 200, 'Payment already verified', data.data, '');
        }

        const transaction = await Transaction.create({
            vendor_id: data.data.metadata?.username || null,
            reference_id: data.data.reference,
            amount: data.data.amount / 100,
            status: data.data.status,
            description: "Subscription Plan",
            method: data.data.channel,
            paid_at: data.data.paid_at
        });

        return responseData(res, 'success', 200, 'Payment verified successfully', transaction, '');

    } catch (error) {
        return responseData(res, 'error', 500, error.message, [], '');
    }
};


module.exports = {
    processPayment,
    verifyPayment,
    getTransaction
}