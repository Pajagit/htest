const express = require("express");
const Router = require("express").Router;
const keys = require("../../../config/keys");
const isEmpty = require("../../../validation/is-empty");
var jwtDecode = require("jwt-decode");
var crypto = require("crypto"),
  algorithm = "aes-256-ctr",
  passwordcrypto = "d6F3Efeq";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../../models/user");

// @route POST api/users/login
// @desc Login user / Returning JWT token
// @access Public
module.exports = Router({ mergeParams: true }).post("/token", (req, res) => {
  var updateDate = new Date();
  var errors = {};
  if (isEmpty(req.body.refreshToken)) {
    return res.status(400).json({ error: "Refresh token is missing" });
  } else {
    function encrypt(text) {
      var cipher = crypto.createCipher(algorithm, passwordcrypto);
      var crypted = cipher.update(text, "utf8", "hex");
      crypted += cipher.final("hex");
      return crypted;
    }
    function decrypt(text) {
      var decipher = crypto.createDecipher(algorithm, passwordcrypto);
      var dec = decipher.update(text, "hex", "utf8");
      dec += decipher.final("utf8");
      return dec;
    }
    decryptedRefresh = decrypt(req.body.refreshToken);
    var profileObj = jwtDecode(decryptedRefresh);

    var currentDate = new Date();
    expDate = new Date(profileObj.exp * 1000);

    //check if refresh token expired and return propper message
    if (expDate < currentDate) {
      errors.email = "Refresh token expired";
      return res.status(401).json(errors);
    }

    User.findOne({
      where: {
        email: profileObj.email,
        active: true
      }
    }).then(user => {
      if (!user) {
        errors.email = profileObj.email + " is not authorized";
        return res.status(401).json(errors);
      } else {
        var newUserValues = {};
        if (profileObj.givenName != user.first_name) {
          newUserValues.first_name = profileObj.givenName;
        }
        if (profileObj.familyName != user.last_name) {
          newUserValues.last_name = profileObj.familyName;
        }
        if (profileObj.imageUrl != user.image_url) {
          newUserValues.image_url = profileObj.imageUrl;
        }

        if (Object.keys(newUserValues).length > 0) {
          newUserValues.updated_at = updateDate;
          User.update(newUserValues, {
            where: { id: user.id }
          });
        }

        // Create jwt payload
        const payload = {
          id: user.id,
          first_name: newUserValues.first_name ? newUserValues.first_name : user.first_name,
          last_name: newUserValues.last_name ? newUserValues.last_name : user.last_name,
          email: user.email,
          image_url: newUserValues.image_url ? newUserValues.image_url : user.image_url
        };

        refreshToken = jwt.sign(payload, keys.secretOrKeyRefresh, {
          expiresIn: keys.refreshTokenDuration
        });
        //Sign Token
        jwt.sign(payload, keys.secretOrKey, { expiresIn: keys.tokenDuration }, (err, token) => {
          cryptedRefresh = encrypt(refreshToken);
          res.json({
            success: true,
            token,
            refreshToken: cryptedRefresh
          });
        });
      }
    });
  }
});
