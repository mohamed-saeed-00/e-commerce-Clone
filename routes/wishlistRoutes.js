const express = require("express");

const router = express.Router({ mergeParams: true });

const authServices = require("../services/authServices");

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getProductsWishlist,
} = require("../services/wishlistServices");

router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowedTo("user"),
    getProductsWishlist
  )
  .post(
    authServices.protect,
    authServices.allowedTo("user"),
    addProductToWishlist
  );

router
  .route("/:productId")
  .post(
    authServices.protect,
    authServices.allowedTo("user"),
    removeProductFromWishlist
  );
module.exports = router;
