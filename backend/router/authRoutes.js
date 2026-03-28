const express = require("express")
const router = express.Router()

// Middleware
const authMiddleware = require("../middleware/auth")

const authController = require("../controller/auth")
router.post("/login", authController.login)
router.put("/changePassword", authMiddleware, authController.changePassword)
router.post("/logout", authController.logout)

module.exports = router