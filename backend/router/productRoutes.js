const express = require("express")
const router = express.Router()

// Middleware
const authMiddleware = require("../middleware/auth")

const productController = require("../controller/product")

router.get("/:vendorUsername", productController.getProduct)
router.get("/id/:vendorUsername", productController.getProductById)

// Vendor dashboard api routes
router.get("/vendor/:vendorUsername", authMiddleware, productController.getAllVendorProduct)
router.get("/vendor/totalProduct/:vendorUsername", authMiddleware, productController.getTotalProduct)
router.post("/vendor/:vendorUsername", authMiddleware, productController.addProduct)
router.delete("/vendor/:vendorUsername/:productId", authMiddleware, productController.deleteProduct)


module.exports = router