const express = require("express");
const router = express.Router();
const {registerUser, loginUser, logout} = require("../controllers/userController");


//register
router.route("/register").post(registerUser);

//user
router.route("/login").post(loginUser);

//logout
router.route("/logout").get(logout);

module.exports = router;