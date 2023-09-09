const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();


//New Order
router.route("/order/new").post(isAuthenticatedUser, newOrder);

//Get Single Order
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

//Get Logged In User Orders
router.route("/orders/me").get(isAuthenticatedUser, myOrders);

//get All orders --ADMIN
router.route("/admin/orders/").get(isAuthenticatedUser,authorizeRoles("admin"), getAllOrders);

//Update Order Status --ADMIN
router.route("/admin/order/:id").put(isAuthenticatedUser,authorizeRoles("admin"), updateOrder);

//delete Order --ADMIN
router.route("/admin/order/:id").delete(isAuthenticatedUser,authorizeRoles("admin"), deleteOrder);



module.exports = router;