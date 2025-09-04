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
  getloggedUserData,
  updateloggedUserpassword,
  updateloggedUserData,
  deleteMe,
  activeMe,
} = require("../services/userServices");

const authServices = require("../services/authServices");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updateUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");

router.get("/me", authServices.protect, getloggedUserData, getSingleUser);
router.put("/updateMyPassword", authServices.protect, updateloggedUserpassword);
router.put("/deleteMe", authServices.protect, deleteMe);
router.put("/activeMe", authServices.protectForActive, activeMe);
router.put(
  "/updateMyData",
  authServices.protect,
  updateLoggedUserValidator,
  updateloggedUserData
);

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
