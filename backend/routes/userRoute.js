const express = require("express");
const router = express.Router();
const {registerUser, loginUser} = require("../controllers/userController");


//register
router.route("/register").post(registerUser);

//user
router.route("/login").post(loginUser);

module.exports = router;