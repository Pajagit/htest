"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "users",
      [
        {
          first_name: "Aleksandar",
          last_name: "Pavlovic",
          email: "aleksandar.pavlovic@htecgroup.com",
          position: "qa",
          active: true
        },
        {
          first_name: "Jana",
          last_name: "Antic",
          email: "jana.antic@htecgroup.com",
          position: "qa",
          active: true
        },
        {
          first_name: "Sandra",
          last_name: "Jeremenkovic",
          email: "sandra.jeremenkovic@htecgroup.com",
          active: true
        },
        {
          first_name: "Milos",
          last_name: "Najdanovic",
          email: "milos.najdanovic@htecgroup.com",
          active: true
        },
        {
          first_name: "Kristijan",
          last_name: "Ristic",
          email: "kristijan.ristic@htecgroup.com",
          active: true
        },
        {
          first_name: "Maja",
          last_name: "Georgijevski",
          email: "maja.georgijevski@htecgroup.com",
          active: true
        },
        {
          first_name: "Boris",
          last_name: "Bizic",
          email: "boris.bizic@htecgroup.com",
          active: true
        },
        {
          first_name: "Uros",
          last_name: "Jeremic",
          email: "uros.jeremic@htecgroup.com",
          active: true
        },
        {
          first_name: "Milos",
          last_name: "Radic",
          email: "milos.radic@htecgroup.com",
          active: true
        },
        {
          first_name: "Mladen",
          last_name: "Radivojevic",
          email: "mladen.radivojevic@htecgroup.com",
          active: true
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  }
};
