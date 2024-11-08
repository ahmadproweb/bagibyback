const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const userAuthMiddleware = require("../middlewares/userMiddleware");

router.post("/register", authController.registerUser);
router.get("/verify-email", authController.verifyEmailToken);
router.post("/login", authController.loginUser);
router.post("/reset-password-request", authController.requestPasswordReset);
router.post("/reset-password", authController.resetPassword);
router.post("/logout", userAuthMiddleware, authController.logoutUser);
router.get("/isAuthenticated", authController.isAuthenticated);
module.exports = router;
