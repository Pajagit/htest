const Role = require("../models/role");

module.exports = {
  getRoles: async function(req, res) {
    if (isNaN(req.params.id)) {
      res.status(400).json({ error: "Role id is not valid number" });
    } else {
      Role.findOne({
        attributes: ["id", "title"],
        where: {
          id: req.params.id
        },
        order: [["id", "DESC"]]
      })
        .then(role => {
          if (role) {
            res.status(200).json(role);
          } else {
            res.status(404).json({ message: "Role doesn't exist" });
          }
        })
        .catch(err => console.log(err));
    }
  },
  getSuperadminRoleId: async function() {
    return new Promise((resolve, reject) => {
      Role.findOne({
        where: {
          title: "Superadmin"
        }
      })
        .then(role => {
          if (role) {
            resolve(role.id);
          } else {
            resolve(false);
          }
        })
        .catch(err => console.log(err));
    });
  },
  checkIfRoleExists: async function(id) {
    return new Promise((resolve, reject) => {
      Role.findOne({
        where: {
          id: id
        },
        attributes: ["id"]
      })
        .then(role => {
          if (role) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(err => console.log(err));
    });
  }
};
