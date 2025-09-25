const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: { type: mongoose.Schema.ObjectId, ref: "product" },
        quantity: { type: Number, default: 1 },
        price: Number,
        color: String,
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDicount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cart", cartSchema);
