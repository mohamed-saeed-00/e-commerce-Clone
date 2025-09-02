const express = require("express");

const router = express.Router({ mergeParams: true });

const { signup, login } = require("../services/authServices");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

router.route("/signup").post(signupValidator, signup);
router.route("/signin").post(loginValidator, login);

// router
//   .route("/:id")
//   .get(getUserValidator, getSingleUser)
//   .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

// router.route("/changePassword/:id").put(updateUserPasswordValidator, updateUserPassword);

module.exports = router;
