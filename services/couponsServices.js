const Coupon = require("../models/couponsModel");

const factory = require("./handlerFactor");

// @desc create a Coupon
// @route post
// @access private

exports.createCoupon = factory.createFctory(Coupon);

// @desc get list of categories
// @route get
// @access public

exports.getCoupons = factory.getAllFactory(Coupon);

// @desc get a specific Coupon
// by id
// @route get
// @access public

exports.getSingelCoupon = factory.singleItemFactory(Coupon);

// @desc update a Coupon
// by id
// @route put
// @access private

exports.updateCoupon = factory.updateOne(Coupon);

// @desc delete a Coupon
// by id
// @route put
// @access private

exports.deleteCoupon = factory.deleteOne(Coupon);
