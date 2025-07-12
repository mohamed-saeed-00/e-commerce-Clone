const asyncHandler = require("express-async-handler");
// eslint-disable-next-line import/no-extraneous-dependencies

// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");

// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");

const User = require("../models/usersModal");

const {
  deleteOne,
  createFctory,
  updateOne,
  getAllFactory,
  singleItemFactory,
} = require("./handlerFactor");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

exports.uploadCategoryImage = uploadSingleImage("profileImg");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const fileName = `user-${uuidv4()}-${Date.now()}-.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${fileName}`);

    // save image at database
    req.body.profileImg = fileName;
  }
  next();
});

// @desc create a user
// @route post
// @access private
exports.createUser = createFctory(User);

// @desc get list of user
// @route get
// @access public
exports.getAllUsers = getAllFactory(User);

// @desc get a specific user by id
// @route get
// @access public
exports.getSingleUser = singleItemFactory(User);

// @desc update a user by id
// @route put
// @access private
exports.updateUser = updateOne(User);

// @desc delete a SubCategory by id
// @route put
// @access private

exports.deleteUser = deleteOne(User);
