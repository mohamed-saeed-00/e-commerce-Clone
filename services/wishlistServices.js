const asyncHandler = require("express-async-handler");

const User = require("../models/usersModel");
// @desc add product to wishlist
// @route post
// @access protect,[user]

exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res
    .status(201)
    .json({ message: "product added to wishlist successfuly", data: user });
});

// @desc remove product from wishlist
// @route post
// @access protect,[user]

exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    message: "product deleted from wishlist successfuly",
    data: user.wishlist,
  });
});

// @desc get product wishlist
// @route get
// @access protect,[user]

exports.getProductsWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(201).json({
    results: user.wishlist.length,
    data: user.wishlist,
  });
});
