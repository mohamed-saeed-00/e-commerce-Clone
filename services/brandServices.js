const Brand = require("../models/brandsModal");

const factory = require("./handlerFactor");

// @desc create a category
// @route post
// @access private

exports.createBrand = factory.createFctory(Brand);

// @desc get list of categories
// @route get
// @access public

exports.getBrands = factory.getAllFactory(Brand);

// @desc get a specific category by id
// @route get
// @access public

exports.getSingelBrand = factory.singleItemFactory(Brand);

// @desc update a category by id
// @route put
// @access private

exports.updateBrand = factory.updateOne(Brand);

// @desc delete a category by id
// @route put
// @access private

exports.deleteBrand = factory.deleteOne(Brand);
