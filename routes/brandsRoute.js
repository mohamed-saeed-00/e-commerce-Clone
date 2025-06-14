const express = require("express");

const router = express.Router();
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const {
  getBrands,
  createBrand,
  getSingelBrand,
  updateBrand,
  deleteBrand,
} = require("../services/brandServices");

router.route("/").get(getBrands).post(createBrandValidator, createBrand);
router
  .route("/:id")
  .get(getBrandValidator, getSingelBrand)
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
