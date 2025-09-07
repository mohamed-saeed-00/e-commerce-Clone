const multer = require("multer");
const asyncHandler = require("express-async-handler");
// eslint-disable-next-line import/no-extraneous-dependencies

// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");

// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");

const AppError = require("../utils/appError");
const Product = require("../models/productModal");
const factory = require("./handlerFactor");
const { uploadMixImages } = require("../middleware/uploadImageMiddleware");

exports.uploadMixImages = uploadMixImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);

exports.resizeImages = asyncHandler(async (req, res, next) => {
  console.log(req.files);
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-imageCover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // save image at database
    req.body.imageCover = imageCoverFileName;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index}.jpeg`;
        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // save image at database
        req.body.images.push(imageName);
      })
    );
  }
  next();
});
// @desc get list of products
// @route get
// @access public
exports.getProducts = factory.getAllFactory(Product, "Products");

// @desc get a specific product by id
// @route get
// @access public
exports.getProduct = factory.singleItemFactory(Product, "reviews");

// @desc create a product
// @route post
// @access private
exports.createProduct = factory.createFctory(Product);

// @desc update a product by id
// @route put
// @access private

exports.updateProduct = factory.updateOne(Product);

// @desc delete a product by id
// @route put
// @access private
exports.deleteProduct = factory.deleteOne(Product);
