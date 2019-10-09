"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "colors",
      [
        {
          code: "#C2AFF0",
          title: "PLUM"
        },
        {
          code: "#4C81B2",
          title: "CYAN_AZURE"
        },
        {
          code: "#4CB29B",
          title: "KEPPEL"
        },
        {
          code: "#D8C069",
          title: "DARK_KHAKI"
        },
        {
          code: "#4C58B2",
          title: "LIBERTY"
        },
        {
          code: "#993766",
          title: "AMARANTH"
        },
        {
          code: "#4CA1B2",
          title: "VERDIGRIS"
        },
        {
          code: "#4CB262",
          title: "MEDIUM_SEA_GREEN"
        },
        {
          code: "#D8756A",
          title: "PALE_COPPER"
        },
        {
          code: "#4CB27F",
          title: "MINT"
        },
        {
          code: "#99373B",
          title: "SMOKY_TOPAZ"
        },
        {
          code: "#7FB24C",
          title: "BUD_GREEN"
        },
        {
          code: "#B29C4C",
          title: "BRAS"
        },
        {
          code: "#D86A6A",
          title: "FUZZY_WUZZY"
        },
        {
          code: "#9AB24C",
          title: "OLIVINE"
        },
        {
          code: "#993737",
          title: "CHESTNUT"
        },
        {
          code: "#B2934C",
          title: "AZTEC_GOLD"
        },
        {
          code: "#B2644C",
          title: "BROWN_SUGAR"
        },
        {
          code: "#D8A56A",
          title: "FAWN"
        },
        {
          code: "#8BB24C",
          title: "TURTLE_GREEN"
        },
        {
          code: "#373799",
          title: "BLUE"
        },
        {
          code: "#B25D4C",
          title: "GIANTS_CLUB"
        },
        {
          code: "#4C70B2",
          title: "BLUE_YONDER"
        },
        {
          code: "#D8D56A",
          title: "BOOGER_BUSTER"
        },
        {
          code: "#894CB2",
          title: "PURPUREUS"
        },
        {
          code: "#993778",
          title: "MAXIMUM_RED_PURPLE"
        },
        {
          code: "#AA4CB2",
          title: "WISTERIA"
        },
        {
          code: "#B24C92",
          title: "MULBERRY"
        },
        {
          code: "#8FD86A",
          title: "PISTACHIO"
        },
        {
          code: "#6AD89A",
          title: "MEDIUM_AQUAMARINE"
        },
        {
          code: "#6AD8D6",
          title: "MIDDLE_BLUE"
        },
        {
          code: "#D86AB2",
          title: "SKY_MAGENTA"
        },
        {
          code: "#D86A84",
          title: "BLUSH"
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("colors", null, {});
  }
};
