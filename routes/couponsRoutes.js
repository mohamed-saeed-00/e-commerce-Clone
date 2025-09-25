const express = require("express");

const router = express.Router();

const authServices = require("../services/authServices");

const {
  getCoupons,
  getSingelCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponsServices");

router.use(authServices.protect, authServices.allowedTo("admin", "manager"));

router.route("/").get(getCoupons).post(createCoupon);
router
  .route("/:id")
  .get(getSingelCoupon)
  .put(updateCoupon)
  .delete(deleteCoupon);

module.exports = router;
