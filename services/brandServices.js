const asyncHandler = require("express-async-handler");
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");
const Brand = require("../models/brandsModal");

const factory = require("./handlerFactor");
const {
  uploadSingleImage
} = require("../middleware/uploadImageMiddleware");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}-.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${fileName}`);

  // save image at database
  req.body.image = fileName;
  next();
});

// @desc create a category
// @route post
// @access private

exports.createBrand = factory.createFctory(Brand);

// @desc get list of categories
// @route get
// @access public

exports.getBrands = factory.getAllFactory(Brand);

// @desc get a specific category by id
// @route get
// @access public

exports.getSingelBrand = factory.singleItemFactory(Brand);

// @desc update a category by id
// @route put
// @access private

exports.updateBrand = factory.updateOne(Brand);

// @desc delete a category by id
// @route put
// @access private

exports.deleteBrand = factory.deleteOne(Brand);
