const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createSubCategoreRules = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2 })
    .withMessage("too short name")
    .isLength({ max: 32 })
    .withMessage("too long name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("category is required")
    .isMongoId()
    .withMessage("invalid category id"),
  validatorMiddleware,
];

exports.updateSubCategoryRules = [
  check("name")
    .notEmpty()
    .withMessage("enter valid name")
    .custom((val, { req }) => {
      if (val) {
        req.body.slug = slugify(val);
      }
      return true;
    }),
  check("id").isMongoId().withMessage("not valid id"),
  validatorMiddleware,
];

exports.getSubCategoryRules = [
  check("id").isMongoId().withMessage("not valid id"),
  validatorMiddleware,
];
