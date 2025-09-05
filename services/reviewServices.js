
const Review = require("../models/reviewModal");

const factory = require("./handlerFactor");

// @desc create a Review
// @route post
// @access protect,[user]

exports.createReview = factory.createFctory(Review);

// @desc get list of Review
// @route get
// @access public

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
