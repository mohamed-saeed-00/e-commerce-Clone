const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getCategoryRules = [
  check("id").isMongoId().withMessage("not valid id"),
  validatorMiddleware,
];

exports.createCategoryRules = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("too short name")
    .isLength({ max: 32 })
    .withMessage("too long name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateCategoryRules = [
  check("id").isMongoId().withMessage("not valid id"),
  check("name").custom((val, { req }) => {
    if (val) {
      req.body.slug = slugify(val);
    }
    return true;
  }),
  validatorMiddleware,
];

exports.deleteCategoryRules = [
  check("id").isMongoId().withMessage("not valid id"),
  validatorMiddleware,
];
