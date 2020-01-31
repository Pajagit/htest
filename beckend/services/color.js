const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Color = require("../models/color");

module.exports = {
  getUnusedColorFromColors: async function(colors) {
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
        if (color.length > 0) {
          resolve(color[0].id);
        } else {
          resolve(false);
        }
      });
    });
  }
};
