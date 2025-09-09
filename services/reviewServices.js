const asyncHandler = require("express-async-handler");

const Review = require("../models/reviewModal");

const factory = require("./handlerFactor");

// @desc create a Review
// @route post
// @access protect,[user]

exports.setProductIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};

exports.createReview = asyncHandler(async (req, res, next) => {
  const document = await Review.create({
    title: req.body.title,
    rating: req.body.rating,
    user: req.user._id,
    product: req.body.product,
  });

  res.status(201).json({ data: document });
});

// @desc get list of Review
// @route get
// @access public

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

exports.getReviews = factory.getAllFactory(Review);

// @desc get a specific Review by id
// @route get
// @access public

exports.getSingelReview = factory.singleItemFactory(Review);

// @desc update a Review by id
// @route put
// @access protect,[user]

exports.updateReview = factory.updateOne(Review);

// @desc delete a Review by id
// @route put
// @access protect,[user,admin]

exports.deleteReview = factory.deleteOne(Review);
