const asyncHandler = require("express-async-handler");
// eslint-disable-next-line import/no-extraneous-dependencies

// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");

// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");
const factory = require("./handlerFactor");

const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

const categoryModel = require("../models/categoryModel");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const fileName = `category-${uuidv4()}-${Date.now()}-.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${fileName}`);

    // save image at database
    req.body.image = fileName;
  }
  next();
});

// @desc get list of categories
// @route get
// @access public

exports.getCategories = factory.getAllFactory(categoryModel);

// @desc get a specific category by id
// @route get
// @access public

exports.getCategory = factory.singleItemFactory(categoryModel);

// @desc create a category
// @route post
// @access private

exports.createCategory = factory.createFctory(categoryModel);

// @desc update a category by id
// @route put
// @access private

exports.updateCategory = factory.updateOne(categoryModel);

// @desc delete a category by id
// @route put
// @access private
exports.deleteCategory = factory.deleteOne(categoryModel);
