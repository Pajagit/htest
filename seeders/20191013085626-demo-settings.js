// "use strict";
// const User = require("../models/user");
// const Project = require("../models/user");

// const UserService = require("../services/user");

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     const users = await Promise.all([User.findAll()]);
//     var usersObjects = [];
//     if (users) {
//       users[0].forEach(async function(user) {

//         projects.forEach(project => {
//           usersObjects.push({
//             user_id: user.id,
//             testcase_date_from: null,
//             testcase_date_to: null,
//             testcase_search_term: null,
//             project_id: 2
//           });
//         });
//       });
//     }

//     return queryInterface.bulkInsert("settings", usersObjects, {});
//   },

//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete("settings", null, {});
//   }
// };
