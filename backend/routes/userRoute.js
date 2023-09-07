const express = require("express");
const router = express.Router();
const {registerUser, loginUser, logout, forgotPassword, resetPassword} = require("../controllers/userController");


//register
router.route("/register").post(registerUser);

//user
router.route("/login").post(loginUser);

//forgot Password
router.route("/password/forgot").post(forgotPassword);

//Reset Password
router.route("/password/reset/:token").put(resetPassword);

//logout
router.route("/logout").get(logout);


module.exports = router;