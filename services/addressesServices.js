const asyncHandler = require("express-async-handler");

const User = require("../models/usersModel");

// @desc add adress to addresses list
// @route post
// @access protect,[user]

exports.addAdressToAddressesList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res
    .status(201)
    .json({ message: "Adress added to addresses successfuly", data: user });
});

// @desc remove product from wishlist
// @route post
// @access protect,[user]

exports.removeAdressFromAddressesList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.adressId } },
    },
    { new: true }
  );

  res.status(200).json({
    message: "Adress deleted from addresses successfuly",
    data: user.addresses,
  });
});

// @desc get addresses list
// @route get
// @access protect,[user]

exports.getAddressesList = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");

  res.status(200).json({
    results: user.addresses.length,
    data: user.addresses,
  });
});
