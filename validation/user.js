const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = {
  validateUserInput: function(data, last_login = null, update = false, anotherUserSameMail) {
    var firstNameLimitMin = 2;
    var firstNameLimitMax = 30;
    var lastNameLimitMin = 2;
    var lastNameLimitMax = 30;
    var positionLimitMin = 2;
    var positionLimitMax = 30;
    var urlImageLimitMax = 255;

    var errors = {};

    data.email = !isEmpty(data.email) ? data.email : "";
    data.first_name = !isEmpty(data.first_name) ? data.first_name : "";
    data.last_name = !isEmpty(data.last_name) ? data.last_name : "";
    data.position = !isEmpty(data.position) ? data.position : "";
    data.image_url = !isEmpty(data.image_url) ? data.image_url : "";
    data.superadmin = !isEmpty(data.superadmin) ? data.superadmin : "";

    // Email validation
    if ((!last_login && update) || !update) {
      if (isEmpty(data.email)) {
        errors.email = "Email is a required field";
      } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
      }
    } else if (!update && !last_login) {
      if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
      }
    }

    //First name validation
    if (!isEmpty(data.first_name)) {
      if (data.first_name.length > firstNameLimitMax || data.first_name.length < firstNameLimitMin) {
        errors.first_name = `First name must be between ${firstNameLimitMin} and ${firstNameLimitMax} characters long (${data.first_name.length})`;
      }
    }

    //Last name validation
    if (!isEmpty(data.last_name)) {
      if (data.last_name.length > lastNameLimitMax || data.last_name.length < lastNameLimitMin) {
        errors.last_name = `Last name must be between ${lastNameLimitMin} and ${lastNameLimitMax} characters long (${data.last_name.length})`;
      }
    }

    //Position validation
    if (!isEmpty(data.position)) {
      if (data.position.length > positionLimitMax || data.position.length < positionLimitMin) {
        errors.position = `Position must be between ${positionLimitMin} and ${positionLimitMax} characters long (${data.position.length})`;
      }
    }

    //Image url validation
    if (!isEmpty(data.image_url)) {
      if (data.image_url.length > urlImageLimitMax) {
        errors.image_url = `Image url can not be more than ${urlImageLimitMax} long (${data.image_url.length})`;
      }
    }

    //Superadmin validation

    if (typeof data.superadmin !== "boolean") {
      errors.superadmin = "Parameter 'superadmin' must have a true or false value";
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  },
  validateUserProjectInput: function(data) {
    var errors = {};
    // Project_id validation
    if (isEmpty(data.project_id)) {
      errors.project_id = "Project id is a required field";
    } else {
      if (isNaN(data.project_id)) {
        errors.project_id = "Project id is not valid number";
      }
    }
    // Role_id validation
    if (isEmpty(data.role_id)) {
      errors.role_id = "Role id is a required field";
    } else {
      if (isNaN(data.role_id)) {
        errors.role_id = "Role id is not valid number";
      }
    }
    return {
      errors,
      isValid: isEmpty(errors)
    };
  },
  validateUserSettingsInput: function(data) {
    var errors = {};

    if (data.testcase) {
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
};
