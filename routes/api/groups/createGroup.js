const Router = require("express").Router;
const passport = require("passport");
const Sequelize = require("sequelize");
const pgURI = require("../../../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const Group = require("../../../models/group");
const Color = require("../../../models/color");

// const validateRoleInput = require("../../../validation/role").validateRoleInput;

// @route POST api/groups/group
// @desc Create new group
// @access Private
module.exports = Router({ mergeParams: true }).post(
  "/groups/group",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // const { errors, isValid } = validateRoleInput(req.body);

    // // Check Validation
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }

    async function checkIfGroupWithSameTitleExists() {
      return new Promise((resolve, reject) => {
        Group.findOne({
          where: {
            title: req.body.title
          }
        })
          .then(group => {
            if (group) {
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch(err => console.log(err));
      });
    }

    async function createGroup(group_fields) {
      return new Promise((resolve, reject) => {
        Group.create({
          title: group_fields.title,
          pinned: group_fields.pinned,
          user_id: group_fields.user_id,
          project_id: group_fields.project_id,
          color_id: group_fields.color_id
        }).then(group => {
          if (group) {
            resolve(group);
          } else {
            resolve(false);
          }
        });
      });
    }

    async function getAllColorsFromGroups() {
      return new Promise((resolve, reject) => {
        Group.findAll({
          attributes: ["color_id"]
        }).then(colors => {
          if (colors) {
            var color_ids_array = [];
            colors.forEach(color => {
              color_ids_array.push(color.color_id);
            });
            resolve(color_ids_array);
          } else {
            resolve([]);
          }
        });
      });
    }

    async function getUnusedColorFromColors(colors) {
      return new Promise((resolve, reject) => {
        Color.findAll({
          where: {
            id: {
              [Op.notIn]: colors
            }
          },
          attributes: ["id"],
          limit: 1
        }).then(color => {
          if (color) {
            resolve(color[0].id);
          } else {
            resolve(false);
          }
        });
      });
    }

    async function getLeastUsedColorFromGroups() {
      return new Promise((resolve, reject) => {
        Group.findAll({
          group: ["color_id"],
          attributes: ["color_id", [sequelize.fn("COUNT", "color_id"), "color_count"]],
          order: [[sequelize.fn("COUNT", "color_id"), "ASC"]],
          limit: 1
        }).then(group => {
          if (group) {
            resolve(group[0].color_id);
          } else {
            resolve(false);
          }
        });
      });
    }

    async function getFields(color) {
      return new Promise((resolve, reject) => {
        if (color) {
          const groupFields = {};
          if (req.body.title) groupFields.title = req.body.title;
          if (req.body.isPinned) groupFields.pinned = req.body.isPinned;
          groupFields.user_id = req.user.id;
          if (req.body.project_id) groupFields.project_id = req.body.project_id;
          groupFields.color_id = color;
          resolve(groupFields);
        } else {
          resolve(false);
        }
      });
    }

    async function returnCreatedGroup(addedGroup) {
      return new Promise((resolve, reject) => {
        if (addedGroup) {
          Group.findOne({
            attributes: ["id", "pinned", "title"],
            where: {
              id: addedGroup.id
            },
            include: [
              {
                model: Color,
                as: "color",
                attributes: ["title"],
                required: true
              }
            ]
          }).then(group => {
            if (group) {
              resolve(group);
            } else {
              resolve(false);
            }
          });
        }
      });
    }

    (async () => {
      var all_colors = await getAllColorsFromGroups();
      var unused_color = await getUnusedColorFromColors(all_colors);
      if (!unused_color) {
        unused_color = await getLeastUsedColorFromGroups();
      }
      var group_exists = await checkIfGroupWithSameTitleExists();
      if (group_exists) {
        res.status(400).json({ error: "Group already exists" });
      } else {
        var group_fields = await getFields(unused_color);
        console.log(group_fields);
        var created_group = await createGroup(group_fields);
        if (created_group) {
          let created_group_obj = await returnCreatedGroup(created_group);
          res.json(created_group_obj);
        } else {
          res.status(500).json({ error: "An error occured while creating group" });
        }
      }
    })();
  }
);
