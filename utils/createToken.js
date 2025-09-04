const jwt = require("jsonwebtoken");

exports.createToken = (payload) =>
  jwt.sign({ user_id: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
