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
const Project = require("../../../models/project");

var UserService = require("../../../services/user");

// @route POST api/users/login
// @desc Login user / Returning JWT token
// @access Public
module.exports = Router({ mergeParams: true }).post("/users/login", (req, res) => {
  var updateDate = new Date();
  var errors = {};
  if (isEmpty(req.body.profileObj)) {
    return res.status(401).json({ error: "Access not authorized" });
  } else {
    User.findOne({
      where: {
        email: req.body.profileObj.email,
        active: true
      },
      include: [
        {
          model: Project,
          attributes: ["id", "title"],
          through: {
            attributes: ["role_id"]
          },
          as: "projects",
          required: false
        }
      ]
    }).then(user => {
      (async () => {
        if (!user) {
          errors.email = req.body.profileObj.email + " is not authorized";
          return res.status(401).json(errors);
        } else {
          user.projects = await UserService.findUserRole(user.projects);
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

          if (Object.keys(newUserValues).length > 0) {
            newUserValues.updated_at = updateDate;
          }
          newUserValues.last_login = new Date();
          User.update(newUserValues, {
            where: { id: user.id }
          });

          // Create jwt payload
          const payload = {
            id: user.id,
            first_name: newUserValues.first_name ? newUserValues.first_name : user.first_name,
            last_name: newUserValues.last_name ? newUserValues.last_name : user.last_name,
            email: user.email,
            image_url: newUserValues.image_url ? newUserValues.image_url : user.image_url,
            active: user.active,
            projects: user.projects
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
      })();
    });
  }
});
