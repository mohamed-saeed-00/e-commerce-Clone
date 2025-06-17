// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require("multer");
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-require
// const { v4: uuidv4 } = require("uuid");
const categoryModel = require("../models/categoryModel");
const factory = require("./handlerFactor");

const AppError = require("../utils/appError");

// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     const fileName = `category-${uuidv4()}-${Date.now()}-.${ext}`;
//     cb(null, fileName);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    console.log(file);
    cb(null, true);
  } else {
    cb(new AppError("only image upload", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadCategoryImage = upload.single("image");

exports.resizeImage = (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}-.jpeg`;
  sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/categories/${fileName}`);

  next();
};

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
