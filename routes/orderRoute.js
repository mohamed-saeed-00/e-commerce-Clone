const express = require("express");

const router = express.Router();

const authServices = require("../services/authServices");

const {
  createOrder,
  getSpecificOrder,
  getAllOrder,
  filterByUserRole,
  updatePaidOrder,
  updateDeliverOrder,
  checkoutSession,
} = require("../services/orderServices");

router.use(authServices.protect);

router
  .route("/checkout-session/:cartId")
  .get(authServices.allowedTo("user"), checkoutSession);

router
  .route("/")
  .get(authServices.allowedTo("user", "admin"), filterByUserRole, getAllOrder);

router.route("/:cartId").post(authServices.allowedTo("user"), createOrder);

router
  .route("/:id")
  .get(authServices.allowedTo("user", "admin"), getSpecificOrder);

router.route("/:id/paid").put(authServices.allowedTo("admin"), updatePaidOrder);
router
  .route("/:id/deliver")
  .put(authServices.allowedTo("admin"), updateDeliverOrder);
module.exports = router;
