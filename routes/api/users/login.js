const express = require("express");
const Router = require("express").Router;
const keys = require("../../../config/keys");
const isEmpty = require("../../../validation/is-empty");
var crypto = require("crypto"),
  algorithm = "aes-256-ctr",
  passwordcrypto = "d6F3Efeq";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../../models/user");

// @route POST api/users/login
// @desc Login user / Returning JWT token
// @access Public
module.exports = Router({ mergeParams: true }).post("/users/login", (req, res) => {
  // Ovde ide logika koja iz google tokena vadi email i proverava da li postoji kod nas taj email
  // Ako postoji uzima podatke tog usera i kreira novi token koji koristimo u app
  var updateDate = new Date();
  var errors = {};
  if (isEmpty(req.body.profileObj)) {
    return res.status(401).json({ error: "Access not authorized" });
  } else {
    User.findOne({
      where: {
        email: req.body.profileObj.email,
        active: true
      }
    }).then(user => {
      if (!user) {
        errors.email = req.body.profileObj.email + " is not authorized";
        return res.status(401).json(errors);
      } else {
        var newUserValues = {};
        if (req.body.profileObj.givenName != user.first_name) {
          newUserValues.first_name = req.body.profileObj.givenName;
        }
        if (req.body.profileObj.familyName != user.last_name) {
          newUserValues.last_name = req.body.profileObj.familyName;
        }
        if (req.body.profileObj.imageUrl != user.image_url) {
          newUserValues.image_url = req.body.profileObj.imageUrl;
        }

        if (Object.keys(newUserValues) > 0) {
          newUserValues.updated_at = updateDate;
          User.update(newUserValues, {
            where: { id: user.id }
          });
        }

        // Create jwt payload
        const payload = {
          id: user.id,
          first_name: newUserValues.first_name,
          last_name: newUserValues.last_name,
          email: user.email,
          image_url: newUserValues.image_url
        };

        function encrypt(text) {
          var cipher = crypto.createCipher(algorithm, passwordcrypto);
          var crypted = cipher.update(text, "utf8", "hex");
          crypted += cipher.final("hex");
          return crypted;
        }

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
