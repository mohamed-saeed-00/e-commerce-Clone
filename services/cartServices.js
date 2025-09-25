const asyncHandler = require("express-async-handler");

const AppError = require("../utils/appError");

const Product = require("../models/productModel");
const Coupon = require("../models/couponsModel");
const Cart = require("../models/cartModel");

// @desc add product to cart if not exist
// @route post
// @access private/user

const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDicount = undefined;
  return totalPrice;
};

exports.addProductTOCart = asyncHandler(async (req, res, nex) => {
  const { productId, color } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  const product = await Product.findById(productId);

  if (!cart) {
    await Cart.create({
      user: req.user._id,
      cartItems: {
        product: productId,
        price: product.price,
        color,
      },
    });
  } else {
    // product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
    } else {
      cart.cartItems.push({ product: productId, price: product.price, color });
    }
  }

  // calculate total price
  calcTotalPrice(cart);

  await cart.save();
  res.status(201).json({
    status: "success",
    message: "product added successfully",
    data: cart,
  });
});

// @desc get all product from cart if not exist
// @route get
// @access private/user

exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError(`your cart is empty : ${cart}`, 404))();
  }
  res.status(200).json({
    productCount: cart.cartItems.length,
    data: cart,
  });
});

// @desc delete specific product from cart if exist
// @route delete
// @access private/user

exports.deleteSpecificProduct = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: {
        cartItems: { _id: req.params.cartItemId },
      },
    },
    {
      new: true,
    }
  );

  calcTotalPrice(cart);
  await cart.save();
  res.status(200).json({
    message: "product deleted from cart successfuly",
    data: cart,
  });
});

// @desc clear cart item
// @route delete
// @access private/user

exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(200).json({
    message: " deleted cart successfuly",
  });
});

// @desc update specific product quantity from cart if exist
// @route delete
// @access private/user

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError("your cart is empty", 404));
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.cartItemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  }

  calcTotalPrice(cart);
  await cart.save();
  res.status(200).json({
    message: "cart item has been updated",
    data: cart,
  });
});

// @desc apply coupon on cart if exist
// @route put
// @access private/user

exports.applyCouponOnCart = asyncHandler(async (req, res, next) => {
  // get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expired: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new AppError("this coupon is invalid", 404));
  }

  // get user cart to calculate total price
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new AppError(`you do not have cart on this id: ${req.user._id}`, 404)
    );
  }
  const totalPrice = cart.totalCartPrice;
  const totalCartPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDicount = totalCartPriceAfterDiscount;
  cart.save();
  res.status(200).json({
    message: "coupon discount has been added",
    data: cart,
  });
});
