const express = require("express")
const router = express.Router()

// Middleware
const authMiddleware = require("../middleware/auth")

const transactionController = require("../controller/transaction")

router.get("/getTransaction", authMiddleware, transactionController.getTransaction) 
router.get("/processPayment", authMiddleware, transactionController.processPayment)
router.get("/verifyPayment", authMiddleware, transactionController.verifyPayment)
router.get("/getAllBankData", authMiddleware, transactionController.getAllBankData)
router.get("/verifyBankAccountData", authMiddleware, transactionController.verifyBankAccountData)

module.exports = router