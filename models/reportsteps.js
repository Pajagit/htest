'use strict';
module.exports = (sequelize, DataTypes) => {
  const ReportSteps = sequelize.define('ReportSteps', {
    test_step_id: DataTypes.INTEGER,
    iput_data: DataTypes.STRING,
    report_id: DataTypes.INTEGER
  }, {});
  ReportSteps.associate = function(models) {
    // associations can be defined here
  };
  return ReportSteps;
};