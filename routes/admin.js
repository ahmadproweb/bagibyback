const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const adminAuthMiddleware = require("../middlewares/adminMiddleware");
const { getAllUsers } = require('../controllers/auth');

router.post("/register", adminController.registerAdmin);
router.post("/verify-email", adminController.verifyEmail);
router.post("/login", adminController.loginAdmin);
router.post("/logout", adminAuthMiddleware, adminController.logoutAdmin);
router.get("/all-users-get", adminAuthMiddleware, getAllUsers);

module.exports = router;
