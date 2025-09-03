const express = require("express");

const router = express.Router({ mergeParams: true });

const { signup, login, forgotPassword } = require("../services/authServices");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

router.route("/signup").post(signupValidator, signup);
router.route("/signin").post(loginValidator, login);
router.post("/forgotPassword", forgotPassword);

module.exports = router;
