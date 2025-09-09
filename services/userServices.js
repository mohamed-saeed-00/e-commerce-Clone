const asyncHandler = require("express-async-handler");
// eslint-disable-next-line import/no-extraneous-dependencies

const bcrypt = require("bcryptjs");

const { v4: uuidv4 } = require("uuid");
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");

const AppError = require("../utils/appError");
// eslint-disable-next-line import/no-extraneous-dependencies

const User = require("../models/usersModel");

const {
  deleteOne,
  createFctory,
  getAllFactory,
  singleItemFactory,
} = require("./handlerFactor");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

const { createToken } = require("../utils/createToken");
const { findByIdAndUpdate } = require("../models/categoryModel");

exports.uploadUserImage = uploadSingleImage("profileImg");

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
// @access private
exports.getSingleUser = singleItemFactory(User);

// @desc update a user by id
// @route put
// @access private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await User.findOneAndUpdate(
    { _id: id },
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new AppError(`no product for this id ${id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @desc update a user password by id
// @route put
// @access private
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await User.findOneAndUpdate(
    { _id: id },
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new AppError(`no product for this id ${id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @desc delete a SubCategory by id
// @route put
// @access private

exports.deleteUser = deleteOne(User);

// @desc get a specific user by id
// @route get
// @access private
exports.getloggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.updateloggedUserpassword = asyncHandler(async (req, res, next) => {
  // 1) get user by id and update it
  const user = await User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  const token = createToken(user._id);

  res.status(200).json({ token });
});
exports.updateloggedUserData = asyncHandler(async (req, res, next) => {
  // 1) get user by id and update it
  const user = await User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ user });
});

exports.deleteMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      active: false,
    },
    { new: true }
  );

  res.status(200).json({ message: "user succcesfully inactive" });
});
exports.activeMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      active: true,
    },
    { new: true }
  );

  res.status(200).json({ message: "user succcesfully active" });
});
