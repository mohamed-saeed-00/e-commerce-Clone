const mongoose = require("mongoose");
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: [true, "name is require"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      require: [true, "email is require"],
      unique: [true, "email must be unique"],
      lowercase: true,
    },
    phone: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    password: {
      type: String,
      require: [true, "password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    passwordChangedAt: { type: Date },
    passwordResetCode: String,
    passwordResetExpired: Date,
    passwordResetVerifyed: Boolean,

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // hashing password before save the document
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("user", userSchema);
