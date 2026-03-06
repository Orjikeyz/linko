const express = require("express")
const router = express.Router()


// Middleware
const authMiddleware = require("../middleware/auth")

// vendor controller
const vendorController = require("../controller/vendor")

// const vendorUsername = ":vendorUsername"
router.get("/:vendorUsername", vendorController.getVendor)
router.put("/:vendorUsername", vendorController.updateVendor)
router.put("/:vendorUsername/logoUpload", authMiddleware,vendorController.updateVendorLogo)

module.exports = router