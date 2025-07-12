const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  uploadCategoryImage,
  resizeImage,
} = require("../services/userServices");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require("../utils/validators/brandValidator");

router
  .route("/")
  .post(uploadCategoryImage, resizeImage, createUserValidator, createUser)
  .get(getAllUsers);

router
  .route("/:id")
  .get(getSingleUser)
  .put(uploadCategoryImage, resizeImage, updateUser)
  .delete(deleteUser);

module.exports = router;
