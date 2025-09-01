const express = require("express");

const router = express.Router({ mergeParams: true });

const { signup, signin } = require("../services/authServices");

const {
  signupValidator,
  signinValidator,
} = require("../utils/validators/authValidator");

router.route("/signup").post(signupValidator, signup);
router.route("/signin").post(signinValidator, signin);

// router
//   .route("/:id")
//   .get(getUserValidator, getSingleUser)
//   .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

// router.route("/changePassword/:id").put(updateUserPasswordValidator, updateUserPassword);

module.exports = router;
