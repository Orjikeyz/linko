const express = require("express")
const router = express.Router()
const productController = require("../controller/product")

router.get("/:vendorUsername", productController.getProduct)

module.exports = router