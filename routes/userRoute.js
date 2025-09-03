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

const authServices = require("../services/authServices");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updateUserPasswordValidator,
} = require("../utils/validators/userValidator");

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  )
  .get(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    getAllUsers
  );

router
  .route("/:id")
  .get(getUserValidator, getSingleUser)
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteUserValidator,
    deleteUser
  );

router
  .route("/changePassword/:id")
  .put(updateUserPasswordValidator, updateUserPassword);

module.exports = router;
