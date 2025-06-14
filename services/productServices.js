
const Product = require("../models/productModal");
const factory = require("./handlerFactor");

// @desc get list of products
// @route get
// @access public
exports.getProducts = factory.getAllFactory(Product,"Products")

// @desc get a specific product by id
// @route get
// @access public
exports.getProduct = factory.singleItemFactory(Product)

// @desc create a product
// @route post
// @access private
exports.createProduct = factory.createFctory(Product)


// @desc update a product by id
// @route put
// @access private

exports.updateProduct = factory.updateOne(Product)

// @desc delete a product by id
// @route put
// @access private
exports.deleteProduct = factory.deleteOne(Product);
