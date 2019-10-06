const Project = require("../models/project");

module.exports = {
  checkIfProjectExist: async function(id) {
    return new Promise((resolve, reject) => {
      Project.findOne({
        where: {
          id: id
        }
      }).then(project => {
        if (project) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
};
