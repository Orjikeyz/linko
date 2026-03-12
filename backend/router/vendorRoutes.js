const express = require("express")
const router = express.Router()


// Middleware
const authMiddleware = require("../middleware/auth")

// vendor controller
const vendorController = require("../controller/vendor")

// const vendorUsername = ":vendorUsername"
router.get("/:vendorUsername", vendorController.getVendor)
router.put("/:vendorUsername", authMiddleware, vendorController.updateVendor)
router.put("/:vendorUsername/logoUpload",  authMiddleware, vendorController.updateVendorLogo)

module.exports = router