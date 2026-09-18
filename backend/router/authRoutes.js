const express = require("express")
const router = express.Router()

// Middleware
const authMiddleware = require("../middleware/auth")
const rateLimiter = require("../middleware/ratelimiter")

const authController = require("../controller/auth")
router.post("/login", rateLimiter, authController.login)
router.post("/register", rateLimiter, authController.register)
router.post("/resendVerificationMail", rateLimiter, authController.resendVerificationMail) //verify otp code
router.post("/accountVerification", rateLimiter, authController.accountVerification) //verify otp code
router.post("/forgetPassword", rateLimiter, authController.sendForgetPasswordMail) //send forget password mail
router.post("/resetPassword", rateLimiter, authController.resetPassword)
router.post("/logout", authController.logout)
router.put("/changePassword", authMiddleware, authController.changePassword)

module.exports = router