const express = require("express")
const router = express.Router()
const transactionController = require("../controller/transaction")

router.get("/processPayment", transactionController.processPayment)
router.get("/verifyPayment", transactionController.verifyPayment)

module.exports = router