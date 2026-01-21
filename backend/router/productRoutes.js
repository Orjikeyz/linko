const express = require("express")
const router = express.Router()
const productController = require("../controller/product")

router.get("/:vendorUsername", productController.getProduct)
router.get("/id/:vendorUsername", productController.getProductById)

// Vendor dashboard api routes
router.get("/vendor/:vendorUsername", productController.getAllVendorProduct)
router.get("/vendor/:vendorUsername", productController.getAllVendorProduct)
router.get("/vendor/totalProduct/:vendorUsername", productController.getTotalProduct)
router.post("/vendor/:vendorUsername", productController.addProduct)
router.delete("/vendor/:vendorUsername/:productId", productController.deleteProduct)

module.exports = router