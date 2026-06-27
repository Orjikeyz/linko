const express = require("express")
const router = express.Router()

// Middleware
const authMiddleware = require("../middleware/auth")
const rateLimiter = require("../middleware/ratelimiter")

const authController = require("../controller/auth")
router.post("/login", rateLimiter, authController.login)
router.post("/register", rateLimiter, authController.register)
router.post("/accountVerification", rateLimiter, authController.accountVerification) //verify otp code
router.put("/changePassword", authMiddleware, authController.changePassword)
router.post("/logout", authController.logout)

module.exports = router