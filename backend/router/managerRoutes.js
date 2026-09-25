const express = require("express")
const router = express.Router()

// Middleware
const authMiddleware = require("../middleware/auth")
const rateLimiter = require("../middleware/ratelimiter")

const manageVendorController = require("../controller/managerController/vendor")
const manageProductController = require("../controller/managerController/product")
const manageTransactionController = require("../controller/managerController/transaction")

// Vendor Routes
router.get("/vendor",  manageVendorController.getVendors)


// Product Routes
router.get("/product",  manageProductController.getProducts)


// Transaction Routes 
router.get("/transaction",  manageTransactionController.getTransactions)

module.exports = router