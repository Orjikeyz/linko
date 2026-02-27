const express = require("express")
const router = express.Router()
const transactionController = require("../controller/transaction")

router.get("/getTransaction", transactionController.getTransaction) 
router.get("/processPayment", transactionController.processPayment)
router.get("/verifyPayment", transactionController.verifyPayment)
router.get("/getAllBankData", transactionController.getAllBankData)
router.get("/verifyBankAccountData", transactionController.verifyBankAccountData)

module.exports = router