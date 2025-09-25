const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: { type: mongoose.Schema.ObjectId, ref: "product" },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "you must login as user"],
    },
    shippingAdress: {
      alias: String,
      details: String,
      phone: String,
      postaCode: String,
    },
    taxPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    totalOrderPrice: { type: Number },
    paymentMethod: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    deliverdAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name profileImg" }).populate({
    path: "cartItems.product",
    select: "title coverImg",
  });
  next();
});

module.exports = mongoose.model("order", orderSchema);
