const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");

router.route("/").post(loginLimiter, authController.login);
router.route("/register").post(authController.registerUser);
router.route("/refresh").get(authController.refresh);
router.route("/logout").post(authController.logout);
router.route("/forget/:token").post(authController.forgotPassword);
router.route("/forget").post(authController.forgot);
router.route("/reset").post(authController.resetPassword);
router.route("/me/:id").get(authController.profile);
router.route("/me").patch(authController.updateProfile);

module.exports = router;
