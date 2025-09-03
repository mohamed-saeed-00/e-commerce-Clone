const asyncHandler = require("express-async-handler");
// eslint-disable-next-line import/no-extraneous-dependencies

// eslint-disable-next-line import/no-extraneous-dependencies
const crypto = require("crypto");

// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const AppError = require("../utils/appError");
// eslint-disable-next-line import/no-extraneous-dependencies

const User = require("../models/usersModal");
const handelMail = require("../utils/handelMails");

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

// give permission to routes

exports.allowedTo = (...userRole) =>
  asyncHandler(async (req, res, next) => {
    if (!userRole.includes(req.user.role)) {
      return next(
        new AppError(
          "you are not allowed to access this route, please login agian..",
          403
        )
      );
    }
    next();
  });

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) check if user exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("This user is not exsit", 404));
  }

  // generate random number from 6 digits
  const resetRandomCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // hashing rest num by crypto
  const hashingResetCode = crypto
    .createHash("sha256")
    .update(resetRandomCode)
    .digest("hex");

  // save hashed code in db
  user.passwordResetCode = hashingResetCode;
  // save passeord expird time in db
  user.passwordResetExpired = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerifyed = false;

  user.save();

  const message = `HI ${user.name},
Please use this code to reset the password for the ecommerce password ${user.email}
Here is your code: ${resetRandomCode}
Thanks.
`;

  try {
    await handelMail({
      email: user.email,
      subject: "please reset your password ",
      message,
    });
  } catch (error) {
    user.passwordResetCode = undefined;

    user.passwordResetExpired = undefined;
    user.passwordResetVerifyed = undefined;

    await user.save();

    return next(new AppError("there are error in sending email", 500));
  }

  res.status(200).json({
    status: 200,
    message: "password reset code has succesfully send to this email",
  });
});
