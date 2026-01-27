const express = require("express")
const router = express.Router()
const paymentController = require("../controller/payment")

router.get("/processPayment", paymentController.processPayment)
router.get("/verifyPayment", paymentController.verifyPayment)

module.exports = router