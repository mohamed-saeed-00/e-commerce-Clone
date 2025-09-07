const { check } = require("express-validator");

const Review = require("../../models/reviewModal");

const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title")
    .notEmpty()
    .withMessage("Review title required")
    .isLength({ min: 3 })
    .withMessage("Too short Review title")
    .isLength({ max: 32 })
    .withMessage("Too long Review title"),
  check("rating")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("rating must be between 1 and 5"),

  // comment this to make user id diynamic and auto put by user._id

  // check("user").isMongoId().withMessage("Invalid User Review id format"),

  check("product")
    .isMongoId()
    .withMessage("Invalid Product Review id format")
    .custom((val, { req }) =>
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("you already have review on this product")
            );
          }
        }
      )
    ),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) =>
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error("there is not review for this id"));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("you are not allowed to perform this action")
          );
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) =>
      Review.findById(val).then((review) => {
        if (req.user.role === "user") {
          if (!review) {
            return Promise.reject(new Error("there is not review for this id"));
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("you are not allowed to perform this action")
            );
          }
        }
        return true;
      })
    ),
  validatorMiddleware,
];
