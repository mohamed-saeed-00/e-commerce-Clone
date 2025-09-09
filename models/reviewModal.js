const mongoose = require("mongoose");
const Product = require("./productModal");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title required"],
      minLength: [3, "Too short brand name"],
      maxLength: [32, "Too long brand name"],
    },

    rating: {
      type: Number,
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

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewSchema.statics.getAvergaRatingAndCount = async function (productId) {
  const result = await this.aggregate([
    // get all reviews by product id
    {
      $match: { product: productId },
    },
    // group all review average and quantity thats belong to this id
    {
      $group: {
        _id: "$product",
        ratingAverage: { $avg: "$rating" },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(
      { _id: productId },
      {
        ratingAverage: result[0].ratingAverage,
        ratingQuantity: result[0].ratingQuantity,
      }
    );
  } else {
    await Product.findByIdAndUpdate(
      { _id: productId },
      {
        ratingAverage: 0,
        ratingQuantity: 0,
      }
    );
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.getAvergaRatingAndCount(this.product);
});
reviewSchema.post("deleteOne", async function () {
  await this.constructor.getAvergaRatingAndCount(this.product);
});

module.exports = mongoose.model("review", reviewSchema);
