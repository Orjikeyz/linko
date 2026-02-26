const express = require("express")
const router = express.Router()

// vendor controller
const vendorController = require("../controller/vendor")

// const vendorUsername = ":vendorUsername"
router.get("/:vendorUsername", vendorController.getVendor)
router.put("/:vendorUsername", vendorController.updateVendor)
router.put("/:vendorUsername/logoUpload", vendorController.updateVendorLogo)

module.exports = router