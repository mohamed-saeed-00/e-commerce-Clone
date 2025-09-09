const SubCategory = require("../models/subCategoryModel");

const factory = require("./handlerFactor");

// @desc create a product
// @route post
// @access private

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createSubCategory = factory.createFctory(SubCategory);


exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// @desc get list of SubCategory
// @route get
// @access public
exports.getSubCategories = factory.getAllFactory(SubCategory);

// @desc get a specific SubCategory by id
// @route get
// @access public

exports.getSubCategory = factory.singleItemFactory(SubCategory);

// @desc update a SubCategory by id
// @route put
// @access private

exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc delete a SubCategory by id
// @route put
// @access private

exports.deleteSubCategory = factory.deleteOne(SubCategory);
