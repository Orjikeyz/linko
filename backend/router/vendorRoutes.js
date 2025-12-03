const express = require("express")
const router = express.Router()

// vendor controller
const vendorController = require("../controller/vendor")

// const vendorUsername = ":vendorUsername"
router.get("/:vendorUsername", vendorController.getVendor)

module.exports = router