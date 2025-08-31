const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  updateUserPassword,
} = require("../services/userServices");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require("../utils/validators/userValidator");

router.route("/changePassword/:id").put(updateUserPassword);

router
  .route("/")
  .post(uploadUserImage, resizeImage, createUserValidator, createUser)
  .get(getAllUsers);

router
  .route("/:id")
  .get(getUserValidator, getSingleUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
