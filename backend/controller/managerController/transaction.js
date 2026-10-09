const express = require("express")
const Transaction = require('../../model/Transaction')
const Vendor = require('../../model/Vendors')
const responseData = require('../../middleware/response')

/*
==================================================
                  TRANSACTIONS
==================================================
*/

// GET /transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 })

    return responseData(res, 'success', 200, 'Transactions retrieved successfully', transactions, '')

  } catch (error) {
    console.error('Get transactions error:', error)

    return responseData(res, 'error', 500, 'Internal server error', [], '')
  }
}


// GET /transactions/:id
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params

    const transaction = await Transaction.findById(id)

    if (!transaction) {
      return responseData(res, 'error', 404, 'Transaction not found', [], '')
    }

    return responseData(res, 'success', 200, 'Transaction retrieved successfully', transaction, '')

  } catch (error) {
    console.error('Get transaction error:', error)

    return responseData(res, 'error', 500, 'Internal server error', [], '')
  }
}


// Approve Transaction
const approveTransaction = async (req, res) => {
  try {
    const { id } = req.body;

    const existingTransaction = await Transaction.findById(id);

    if (!existingTransaction) {
      return responseData(res, "error", 404, "Transaction not found", [], "");
    }

    if (existingTransaction.status !== "pending") {
      return responseData(res, "error", 409, "Only pending transactions can be approved", [], "");
    }

    const updatedTransaction = await Transaction.findOneAndUpdate({ _id: id, status: "pending" }, { status: "success" }, { returnDocument: "after"});

    if (!updatedTransaction) {
      return responseData(res, "error", 409, "Transaction has already been processed", [], "");
    }

    const vendorData = await Vendor.findOneAndUpdate({ username: updatedTransaction.vendor_id }, { $set: { plan: "pro" } }, { returnDocument: "after"});

    if (!vendorData) {
      return responseData(res, "error", 404, "Vendor not found", [], "");
    }

    // Send Subscription Mail
    try {
      const response = await fetch("https://cloudstorage.codeph.ng/linkostorage/subscriptionPaymentMail.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: vendorData.brand_email,
          name: vendorData.brand_name || "Customer",
          plan: vendorData.plan || "",
          amount: updatedTransaction.amount || "",
          currency: "NGN",
          billing_cycle: "",
          reference: updatedTransaction.reference_id || "",
          payment_date: updatedTransaction.createdAt || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
          next_billing: ""
        })
      });

      if (!response.ok) {
        return responseData(res, "error", 400, "Sorry an error occurred while processing subscriptioun approve mail", [], "");
      }

      const data = await response.json();
      return responseData(res, "success", 200, "Transaction approved successfully", updatedTransaction, "");

    } catch (error) {
      console.error("Error sending mail:", error);
      return responseData(res, "error", 500, "Error sending subscription approve mail", [], "");
    }

  } catch (error) {
    console.error("Error approving transaction:", error);
    return responseData(res, "error", 500, "Internal server error", [], "");
  }
};


// Reverse Transaction
const reverseTransaction = async (req, res) => {
  try {
    const { id } = req.body;

    const existingTransaction = await Transaction.findById(id);

    if (!existingTransaction) {
      return responseData(res, "error", 404, "Transaction not found", [], "");
    }

    if (existingTransaction.status !== "success") {
      return responseData(res, "error", 409, "Only pending transactions can be reversed", [], "");
    }

    const updatedTransaction = await Transaction.findOneAndUpdate({ _id: id, status: "success" }, {status: "pending"}, { returnDocument: "after"});

    if (!updatedTransaction) {
      return responseData(res, "error", 409, "Transaction has already been processed", [], "");
    }

    return responseData(res, "success", 200, "Transaction reversed successfully", updatedTransaction, "");

  } catch (error) {
    console.error("Error reversing transaction:", error);
    return responseData(res, "error", 500, "Internal server error", [], "");
  }
};



module.exports = {
  getTransactions,
  getTransactionById,
  approveTransaction,
  reverseTransaction
}
