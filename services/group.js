const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Group = require("../models/group");
const Color = require("../models/color");
const GroupTestCases = require("../models/grouptestcase");

module.exports = {
  getGroupById: async function(id) {
    return new Promise((resolve, reject) => {
      Group.findOne({
        attributes: ["id", "pinned", "title"],
        where: {
          id: id
        },
        include: [
          {
            model: Color,
            as: "color",
            attributes: ["title"],
            required: true
          }
        ]
      })
        .then(group => {
          var groupObject = {};
          if (group) {
            groupObject.id = group.id;
            groupObject.isPinned = group.pinned;
            groupObject.title = group.title;
            groupObject.color = group.color.title;
            resolve(groupObject);
          } else {
            resolve(false);
          }
        })
        .catch(err => console.log(err));
    });
  },
  checkIfGroupExistById: async function(id) {
    return new Promise((resolve, reject) => {
      Group.findOne({
        where: {
          id: id
        }
      }).then(group => {
        if (group) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  checkIfGroupWithSameTitleExists: async function(title, project_id) {
    return new Promise((resolve, reject) => {
      Group.findOne({
        where: {
          title: title,
          project_id: project_id
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
  },
  checkIfAnotherGroupWithSameTitleExists: async function(title, id, project_id) {
    return new Promise((resolve, reject) => {
      Group.findOne({
        where: {
          title: title,
          id: {
            [Op.ne]: id
          },
          project_id: project_id
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
  },
  createGroup: async function(group_fields) {
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
  },
  updateGroup: async function(id, groupFields) {
    return new Promise((resolve, reject) => {
      Group.update(groupFields, {
        where: { id: id },
        returning: true,
        plain: true
      }).then(group => {
        if (group[1]) {
          resolve(group[1]);
        } else {
          resolve(false);
        }
      });
    });
  },
  groupHasTestcases: async function(id) {
    return new Promise((resolve, reject) => {
      GroupTestCases.count({
        where: {
          group_id: id
        }
      }).then(testCasesCount => {
        if (testCasesCount > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  removeGroup: async function(id) {
    return new Promise((resolve, reject) => {
      Group.destroy({
        where: {
          id: id
        }
      }).then(removedRows => {
        if (removedRows === 1) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  getAllProjectGroups: async function(id) {
    return new Promise((resolve, reject) => {
      Group.findAll({
        attributes: ["id", "pinned", "title"],
        where: {
          project_id: id
        },
        include: [
          {
            model: Color,
            as: "color",
            attributes: ["title"],
            required: true
          }
        ],
        order: [["id", "ASC"]]
      }).then(groups => {
        if (groups) {
          var groupsObj = Array();
          groups.forEach(group => {
            var groupObject = {
              id: group.id,
              isPinned: group.pinned,
              title: group.title,
              color: group.color.title
            };
            groupsObj.push(groupObject);
          });

          resolve(groupsObj);
        } else {
          resolve([]);
        }
      });
    });
  },
  getAllColorsFromGroups: async function() {
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
  },
  getLeastUsedColorFromGroups: async function() {
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
  },
  returnCreatedOrUpdatedGroup: async function(createdOrUpdatedGroup) {
    return new Promise((resolve, reject) => {
      if (createdOrUpdatedGroup) {
        Group.findOne({
          attributes: ["id", "pinned", "title"],
          where: {
            id: createdOrUpdatedGroup.id
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
  },
  getFields: async function(bodyData, user, color) {
    return new Promise((resolve, reject) => {
      if (color) {
        const groupFields = {};
        if (bodyData.title) groupFields.title = bodyData.title;
        if (bodyData.pinned) groupFields.pinned = bodyData.pinned;
        groupFields.user_id = user.id;
        if (bodyData.project_id) groupFields.project_id = bodyData.project_id;
        groupFields.color_id = color;
        resolve(groupFields);
      } else {
        resolve(false);
      }
    });
  }
};
