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
  resizeImage,
} = require("../services/categoryServcies");

const subCategoryRoutes = require("./subCategoryRoutes");

// nested route
router.use("/:categoryId/subcategories", subCategoryRoutes);

router
  .route("/")
  .get(getCategories)
  .post(uploadCategoryImage, resizeImage, createCategoryRules, createCategory);

router
  .route("/:id")
  .get(getCategoryRules, getCategory)
  .put(uploadCategoryImage, resizeImage,updateCategoryRules, updateCategory)
  .delete(deleteCategoryRules, deleteCategory);

module.exports = router;
