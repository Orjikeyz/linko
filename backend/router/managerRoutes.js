const express = require("express")
const router = express.Router()

// Middleware
const authMiddleware = require("../middleware/auth")
const rateLimiter = require("../middleware/ratelimiter")

const managerController = require("../controller/managerController/vendor")
router.get("/vendor", rateLimiter, managerController.getVendors)


module.exports = router