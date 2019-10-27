const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Browser = require("../models/browser");
const paginate = require("../utils/pagination").paginate;

module.exports = {
  getAllBrowsers: async function() {
    return new Promise((resolve, reject) => {
      Browser.findAll({
        attributes: ["id", "title", "screen_resolution", "version", "deleted"],
        where: {
          deleted: false
        },
        order: [["title", "ASC"]]
      }).then(browsers => {
        var page = 1;
        var pages = 0;
        if (browsers.length > 0) {
          page = 1;
          pages = 1;
        }
        resolve({ browsers, page, pages });
      });
    });
  },
  getAllBrowsersPaginated: async function(page, pageSize) {
    return new Promise((resolve, reject) => {
      Browser.findAndCountAll({
        where: {
          deleted: false
        },
        attributes: ["id", "title", "screen_resolution", "version"],
        ...paginate({ page, pageSize }),
        order: [["title", "ASC"]]
      }).then(browser_obj => {
        var browsers = browser_obj.rows;
        var pages = 1;
        if (browser_obj.count > 0) {
          pages = Math.ceil(browser_obj.count / pageSize);
        }
        page = Number(page);

        resolve({ browsers, page, pages });
      });
    });
  },
  getBrowserById: async function(id) {
    return new Promise((resolve, reject) => {
      Browser.findOne({
        where: {
          deleted: false
        },
        attributes: ["id", "title", "screen_resolution", "version"],
        where: {
          id: id,
          deleted: false
        }
      }).then(browser => {
        if (browser) {
          resolve(browser);
        } else {
          resolve(false);
        }
      });
    });
  },
  createBrowser: async function(browser_fields) {
    return new Promise((resolve, reject) => {
      Browser.create(browser_fields).then(browser => {
        if (browser) {
          resolve(browser);
        } else {
          resolve(false);
        }
      });
    });
  },
  returnCreatedOrUpdatedBrowser: async function(createdOrUpdatedBrowser) {
    return new Promise((resolve, reject) => {
      if (createdOrUpdatedBrowser) {
        Browser.findOne({
          attributes: ["id", "title", "screen_resolution", "version"],
          where: {
            id: createdOrUpdatedBrowser.id
          }
        }).then(browser => {
          if (browser) {
            resolve(browser);
          } else {
            resolve(false);
          }
        });
      }
    });
  },
  checkIfBrowserExist: async function(data) {
    return new Promise((resolve, reject) => {
      Browser.findOne({
        attributes: ["id"],
        where: {
          title: data.title,
          version: data.version,
          screen_resolution: data.screen_resolution
        }
      }).then(browser => {
        if (browser) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  checkIfSameBrowserExist: async function(data, id) {
    return new Promise((resolve, reject) => {
      Browser.findOne({
        attributes: ["id"],
        where: {
          title: data.title,
          version: data.version,
          screen_resolution: data.screen_resolution,
          id: {
            [Op.ne]: id
          }
        }
      }).then(browser => {
        if (browser) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  updateBrowser: async function(id, browserFields) {
    return new Promise((resolve, reject) => {
      browserFields.updated_at = new Date();
      Browser.update(browserFields, {
        where: { id: id },
        returning: true,
        plain: true
      }).then(browser => {
        if (browser[1]) {
          resolve(browser[1]);
        } else {
          resolve(false);
        }
      });
    });
  }
};
