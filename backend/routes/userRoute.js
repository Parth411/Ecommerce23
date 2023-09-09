const express = require("express");
const router = express.Router();
const {registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser} = require("../controllers/userController");

const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");


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

//getUserDetails
router.route("/me").get(isAuthenticatedUser, getUserDetails);

//UpdatePassword
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

//UpdateProfile
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

//GetAllUserDetail (--ADMIN)
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

//Get Single User (--ADMIN)
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser);

//Update User Role
router.route('/admin/user/:id').put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole);

//Delete User
router.route('/admin/user/:id').delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);






module.exports = router;