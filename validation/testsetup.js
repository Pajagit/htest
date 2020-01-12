const isEmpty = require("./is-empty");

module.exports = {
  validateGetTestSetup: function(data) {
    var errors = {};

    if (isEmpty(data.project_id)) {
      errors.project_id = "Project id is a required field";
    } else {
      if (isNaN(data.project_id)) {
        errors.project_id = "Project id is not valid number";
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  },
  validateUpdateTestSetup: function(data) {
    var errors = {};

    if (isEmpty(data.project_id)) {
      errors.project_id = "Project id is a required field";
    } else {
      if (isNaN(data.project_id)) {
        errors.project_id = "Project id is not valid number";
      }
    }

    if (isEmpty(data.testsetupitem_id)) {
      errors.testsetupitem_id = "Test setup item id is a required field";
    } else {
      if (isNaN(data.testsetupitem_id)) {
        errors.testsetupitem_id = "Test setup item id is not valid number";
      }
    }
    if (data.used !== "true" && data.used !== "false") {
      errors.used = "Parameter 'used' must have a true or false value";
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
};
