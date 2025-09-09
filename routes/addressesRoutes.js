const express = require("express");

const router = express.Router({ mergeParams: true });

const authServices = require("../services/authServices");

const {
  addAdressToAddressesList,
  removeAdressFromAddressesList,
  getAddressesList,
} = require("../services/addressesServices");

router
  .route("/")
  .get(authServices.protect, authServices.allowedTo("user"), getAddressesList)
  .post(
    authServices.protect,
    authServices.allowedTo("user"),
    addAdressToAddressesList
  );

router
  .route("/:adressId")
  .post(
    authServices.protect,
    authServices.allowedTo("user"),
    removeAdressFromAddressesList
  );
module.exports = router;
