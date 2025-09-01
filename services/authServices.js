const asyncHandler = require("express-async-handler");
// eslint-disable-next-line import/no-extraneous-dependencies

// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const AppError = require("../utils/appError");
// eslint-disable-next-line import/no-extraneous-dependencies

const User = require("../models/usersModal");

// @desc sign up
// @route post
// @access public

exports.signup = asyncHandler(async (req, res, next) => {
  // #1 create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // #2 create jwt
  const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  res.json({ data: user, token });
});

// @desc sign in
// @route post
// @access public
exports.signin = asyncHandler(async (req, res, next) => {
  // #1 find if user exist
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError(`email or password is incorrect`, 404));
  }

  // #2 if user exist create jwt
  const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.json({ data: user.id, token });
});
