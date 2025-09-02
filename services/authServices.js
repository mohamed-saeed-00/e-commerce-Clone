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

// @desc login
// @route post
// @access public
exports.login = asyncHandler(async (req, res, next) => {
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

// @desc check if user is login or no

exports.protect = asyncHandler(async (req, res, next) => {
  // 1) check if there is token or no
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("there is no token please login", 401));
  }

  // 2)verify token (no change or expired)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) check if user exist
  const currentUser = await User.findById(decoded.user_id);
  if (!currentUser) {
    return next(new AppError("user not exist", 401));
  }

  // 4) check if user change his password after login
  if (currentUser.passwordChangedAt) {
    const currentUserChanedPassTime = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (currentUserChanedPassTime > decoded.iat) {
      return next(
        new AppError(
          "User recently changed his password,please login again",
          401
        )
      );
    }
  }
  req.user = currentUser;
  next();
});
