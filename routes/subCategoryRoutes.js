const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryService");

const {
  createSubCategoreRules,
  updateSubCategoryRules,
  getSubCategoryRules,
} = require("../utils/validators/subCategoryValidator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(setCategoryIdToBody, createSubCategoreRules, createSubCategory)
  .get(createFilterObj, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryRules, getSubCategory)
  .put(updateSubCategoryRules, updateSubCategory)
  .delete(deleteSubCategory);

module.exports = router;
