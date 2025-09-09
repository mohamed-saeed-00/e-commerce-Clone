const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Category = require("../../models/categoryModel");
const Subcategory = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 char")
    .notEmpty()
    .withMessage("product required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("description is required")
    .isLength({ max: 2000 })
    .withMessage("too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity is required")
    .isNumeric()
    .withMessage("product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("sold product must be a number"),
  check("price")
    .notEmpty()
    .withMessage("product price is required")
    .isNumeric()
    .withMessage("product price must be a number")
    .isFloat({ max: 999999 })
    .withMessage("too high price"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("priceAfterDicount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("PriceAfterDisount must be lower than price ");
      }
      return true;
    }),
  check("colors").optional().isArray().withMessage("colors must be array"),
  check("imageCover").notEmpty().withMessage("product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("product images must be array of strings"),
  check("category")
    .notEmpty()
    .withMessage("product must be belong to a category")
    .isMongoId()
    .withMessage("invalid category id ")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`Not valid category id: ${categoryId}`);
      }
      return true;
    }),
  check("subcategory")
    .optional()
    .isMongoId()
    .withMessage("invalid subcategory id")
    .custom(async (subcategoryIds) => {
      const subcategorys = await Subcategory.find({
        _id: { $exists: true, $in: subcategoryIds },
      });
      if (
        subcategorys.length < 1 ||
        subcategorys.length !== subcategoryIds.length
      ) {
        throw new Error(`not valid subcategories ids : ${subcategorys}`);
      }
    })
    .custom(async (val, { req }) => {
      const subcategories = await Subcategory.find({
        category: req.body.category,
      });
      const subcategoriesIdb = subcategories.map((sub) => sub._id.toString());

      const isValid = val.every((id) => subcategoriesIdb.includes(id));
      if (!isValid) {
        throw new Error(`not valid subcategories ids : ${val}`);
      }
    }),
  check("brand").optional().isMongoId().withMessage("not valid brands id"),
  check("rateingAverage")
    .optional()
    .isNumeric()
    .withMessage("rateingAverage must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("ratingAverage must be between 1.0 and 5.0"),
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingQuantity must be a number"),

  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("invalid product id"),

  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("invalid product id"),
  check("title").custom((val, { req }) => {
    if (val) {
      req.body.slug = slugify(val);
    }
    return true;
  }),

  validatorMiddleware,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("invalid product id"),

  validatorMiddleware,
];
