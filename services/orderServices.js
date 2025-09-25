// eslint-disable-next-line import/no-extraneous-dependencies
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");

const Order = require("../models/orderModel");
const AppError = require("../utils/appError");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const factory = require("./handlerFactor");

// @desc create a order
// @route post
// @access private/user

exports.createOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  // get cart depend on cartid
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError("you do not have cart", 404));
  }

  const totalPrice = cart.totalPriceAfterDicount
    ? cart.totalPriceAfterDicount
    : cart.totalCartPrice;
  //   get order price depend on cart total price
  const totalOrderPrice = totalPrice + taxPrice + shippingPrice;

  //   create order with default payment method
  const order = await Order.create({
    cartItems: cart.cartItems,
    user: req.user._id,
    shippingAdress: req.body,
    totalOrderPrice,
    paidAt: Date.now(),
  });

  //   after create order (decreament order quntity - increament sold )on product model
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: {
          _id: item.product,
        },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
  }

  //   clear cart depend cartId
  await Cart.findByIdAndDelete(req.params.cartId);

  res.status(201).json({
    status: "success",
    data: order,
  });
});

// @desc get all order thats belongs to the user
// @route get
// @access private/user

exports.filterByUserRole = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});

exports.getAllOrder = factory.getAllFactory(Order);

// @desc get specific order that belongs to the user
// @route get
// @access private/user

exports.getSpecificOrder = factory.singleItemFactory(Order);

// @desc update specific order paid and delivered
// @route put
// @access private/admin

exports.updatePaidOrder = asyncHandler(async (req, res, next) => {
  // get order by id
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("there is no order for this id"));
  }

  // update isPaid and piadAt
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();
  res.status(201).json({
    satuts: "success",
    Data: updatedOrder,
  });
});

// @desc update specific order deliver and delivered
// @route put
// @access private/admin
exports.updateDeliverOrder = asyncHandler(async (req, res, next) => {
  // get order by id
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("there is no order for this id"));
  }

  // update isPaid and piadAt
  order.isDelivered = true;
  order.deliverdAt = Date.now();

  const updatedOrder = await order.save();
  res.status(201).json({
    satuts: "success",
    Data: updatedOrder,
  });
});

// @desc create stripe session
// @route get
// @access private/user

exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  //1) get cart depend on cartid
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new AppError("you do not have cart", 404));
  }

  const orderPrice = cart.totalPriceAfterDicount
    ? cart.totalPriceAfterDicount
    : cart.totalCartPrice;

  const totalOrderPrice = orderPrice + taxPrice + shippingPrice;
  const unitAmount = Math.max(0, Math.round(totalOrderPrice * 100));

  // 3) create stripe checkout session

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: `Order for ${req.user.name}`,
            description: "Checkout for cart items",
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    success_url: `${req.protocole}://${req.get("host")}/orders`,
    cancel_url: `${req.protocole}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAdress,
  });

  // 4) send session to response
  res.status(200).json({ status: "success", session });
});
