const express = require("express");

const router = express.Router();

const authServices = require("../services/authServices");

const {
  addProductTOCart,
  getCart,
  deleteSpecificProduct,
  clearCart,
  updateCartItemQuantity,
  applyCouponOnCart,
} = require("../services/cartServices");

router.use(authServices.protect, authServices.allowedTo("user"));
router
  .route("/")
  .delete(clearCart)
  .post(addProductTOCart)
  .get(getCart)
  .put(applyCouponOnCart);

router
  .route("/:cartItemId")
  .delete(deleteSpecificProduct)
  .put(updateCartItemQuantity);

module.exports = router;
