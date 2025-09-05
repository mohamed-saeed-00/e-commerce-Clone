const express = require("express");

const router = express.Router();
const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const authServices = require("../services/authServices");

const {
  getReviews,
  createReview,
  getSingelReview,
  updateReview,
  deleteReview,
} = require("../services/reviewServices");

router
  .route("/")
  .get(getReviews)
  .post(
    authServices.protect,
    authServices.allowedTo("user"),
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReviewValidator, getSingelReview)
  .put(
    authServices.protect,
    authServices.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("user", "admin"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
