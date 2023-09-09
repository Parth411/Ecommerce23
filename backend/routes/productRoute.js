const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetail, createProductReview, getProductReviews, deleteProductReview } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
//const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get( getAllProducts);

router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"),updateProduct)
                            .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/product").get(getProductDetail);

//review routes
router.route("/review").put(isAuthenticatedUser, createProductReview);

//All review of product
router.route("/reviews").get(isAuthenticatedUser, getProductReviews);

//Delete review of product
router.route("/reviews").delete(isAuthenticatedUser, deleteProductReview);


                            





module.exports = router;