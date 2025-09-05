const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title required"],
      minLength: [3, "Too short brand name"],
      maxLength: [32, "Too long brand name"],
    },

    rating: {
      type: String,
      required: [true, "rating is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "user is required"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
      required: [true, "product required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("review", reviewSchema);
