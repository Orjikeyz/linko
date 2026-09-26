const express = require("express")
const router = express.Router()

// Middleware
const authMiddleware = require("../middleware/auth")
const adminAccess = require("../middleware/adminAccess")
const rateLimiter = require("../middleware/ratelimiter")

const manageVendorController = require("../controller/managerController/vendor")
const manageProductController = require("../controller/managerController/product")
const manageTransactionController = require("../controller/managerController/transaction")

// Vendor Routes
router.get("/vendor", authMiddleware, adminAccess,  manageVendorController.getVendors)


// Product Routes
router.get("/product",  authMiddleware, adminAccess, manageProductController.getProducts)


// Transaction Routes 
router.get("/transaction", authMiddleware, adminAccess,  manageTransactionController.getTransactions)

module.exports = router