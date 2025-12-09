const express = require("express")
const router = express.Router()
const productController = require("../controller/product")

router.get("/:vendorUsername", productController.getProduct)
router.get("/id/:vendorUsername", productController.getProductById)

module.exports = router