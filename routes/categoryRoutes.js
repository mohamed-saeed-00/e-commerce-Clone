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

const authServices =require("../services/authServices")
// nested route
router.use("/:categoryId/subcategories", subCategoryRoutes);

router
  .route("/")
  .get(getCategories)
  .post(authServices.protect,authServices.allowedTo("admin","manager"),uploadCategoryImage, resizeImage, createCategoryRules, createCategory);

router
  .route("/:id")
  .get(getCategoryRules, getCategory)
  .put(authServices.protect,authServices.allowedTo("admin","manager"),uploadCategoryImage, resizeImage,updateCategoryRules, updateCategory)
  .delete(authServices.protect,authServices.allowedTo("admin"),deleteCategoryRules, deleteCategory);

module.exports = router;
