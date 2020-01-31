const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Environment = require("../models/environment");
const paginate = require("../utils/pagination").paginate;

module.exports = {
  getAllEnvironments: async function(project_id) {
    return new Promise((resolve, reject) => {
      Environment.findAll({
        attributes: ["id", "title", "used"],
        where: {
          project_id: project_id,
          deprecated: false
        },
        order: [["title", "ASC"]]
      }).then(environments => {
        var page = 1;
        var pages = 0;
        if (environments.length > 0) {
          page = 1;
          pages = 1;
        }
        resolve({ environments, page, pages });
      });
    });
  },
  getAllEnvironmentsPaginated: async function(project_id, page, pageSize) {
    return new Promise((resolve, reject) => {
      Environment.findAndCountAll({
        where: {
          project_id: project_id,
          deprecated: false
        },
        attributes: ["id", "title", "used"],
        ...paginate({ page, pageSize }),
        order: [["title", "ASC"]]
      }).then(environment_obj => {
        var environments = environment_obj.rows;
        var pages = 1;
        if (environment_obj.count > 0) {
          pages = Math.ceil(environment_obj.count / pageSize);
        }
        page = Number(page);

        resolve({ environments, page, pages });
      });
    });
  },
  getEnvironmentProject: async function(id) {
    return new Promise((resolve, reject) => {
      Environment.findOne({
        attributes: ["project_id"],
        where: {
          id: id
        }
      }).then(environment => {
        if (environment) {
          resolve(environment);
        } else {
          resolve(false);
        }
      });
    });
  },
  getEnvironmentById: async function(id) {
    return new Promise((resolve, reject) => {
      Environment.findOne({
        attributes: ["id", "title", "used"],
        where: {
          id: id,
          deprecated: false
        }
      }).then(environment => {
        if (environment) {
          resolve(environment);
        } else {
          resolve(false);
        }
      });
    });
  },
  checkIfEnvironmentExistById: async function(id) {
    return new Promise((resolve, reject) => {
      Environment.findOne({
        attributes: ["id"],
        where: {
          id: id,
          deprecated: false
        }
      }).then(environment => {
        if (environment) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  createEnvironment: async function(env_fields) {
    return new Promise((resolve, reject) => {
      Environment.create(env_fields).then(environment => {
        if (environment) {
          var env = {};
          env.id = environment.id;
          env.title = environment.title;
          env.used = environment.used;
          resolve(env);
        } else {
          resolve(false);
        }
      });
    });
  },
  returnCreatedOrUpdatedEnvironment: async function(createdOrUpdatedEnvironment) {
    return new Promise((resolve, reject) => {
      if (createdOrUpdatedEnvironment) {
        Environment.findOne({
          attributes: ["id", "title", "used"],
          where: {
            id: createdOrUpdatedEnvironment.id
          }
        }).then(environment => {
          if (environment) {
            resolve(environment);
          } else {
            resolve(false);
          }
        });
      }
    });
  },
  updateEnvironment: async function(id, envFields) {
    return new Promise((resolve, reject) => {
      envFields.updated_at = new Date();
      Environment.update(envFields, {
        where: { id: id },
        returning: true,
        plain: true
      }).then(environment => {
        if (environment[1]) {
          resolve(environment[1]);
        } else {
          resolve(false);
        }
      });
    });
  },
  setAsDeprecated: async function(id) {
    return new Promise((resolve, reject) => {
      var envFields = {};
      envFields.updated_at = new Date();
      envFields.deprecated = true;
      envFields.used = false;
      Environment.update(envFields, {
        where: { id: id },
        returning: true,
        plain: true
      }).then(environment => {
        if (environment[1]) {
          resolve(environment[1]);
        } else {
          resolve(false);
        }
      });
    });
  },
  setAsUsed: async function(id, used) {
    return new Promise((resolve, reject) => {
      var envFields = {};
      envFields.used = used;
      Environment.update(envFields, {
        where: { id: id },
        returning: true,
        plain: true
      }).then(environment => {
        if (environment[1]) {
          resolve(environment[1]);
        } else {
          resolve(false);
        }
      });
    });
  }
};
