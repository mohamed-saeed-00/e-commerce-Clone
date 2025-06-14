const express = require("express");
const {
  getCategoryRules,
  createCategoryRules,
  updateCategoryRules,
  deleteCategoryRules,
} = require("../utils/validators/categoryValidatorRules");

const router = express.Router();
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
} = require("../services/categoryServcies");

const subCategoryRoutes = require("./subCategoryRoutes");

// nested route
router.use("/:categoryId/subcategories", subCategoryRoutes);

router.route("/").get(getCategories).post(uploadCategoryImage,createCategoryRules, createCategory);

router
  .route("/:id")
  .get(getCategoryRules, getCategory)
  .put(updateCategoryRules, updateCategory)
  .delete(deleteCategoryRules, deleteCategory);

module.exports = router;
