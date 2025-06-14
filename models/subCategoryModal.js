const mongoose = require("mongoose");

const SubCategoryModal = new mongoose.Schema(
  {
    name: {
      type: String,
      required:true,
      unique: [true, "sub category name must be unique"],
      trim: true,
      minLength: [3, "too short name"],
      maxLength: [32, "too long name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "category required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("subCategory", SubCategoryModal);
