const isEmpty = require("./is-empty");

module.exports = {
  validateGetEnvironments: function(data, dataBody) {
    var errors = {};

    if (!isEmpty(data.page) && isNaN(data.page)) {
      errors.page = "Page is not a valid number";
    }

    if (!isEmpty(data.page_size) && isNaN(data.page_size)) {
      errors.page_size = "Page size is not a valid number";
    }
    if (isEmpty(dataBody.project_id)) {
      errors.project_id = "Project id is required";
    } else {
      if (isNaN(dataBody.project_id)) {
        errors.project_id = "Project id is not a valid number";
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  },
  validateEnvironmentInput: function(data, create_environment) {
    var errors = {};

    var titleLimit = 150;

    data.title = !isEmpty(data.title) ? data.title : "";
    data.used = !isEmpty(data.used) ? data.used : "";
    if (typeof data.used === "boolean") {
      data.used = data.used;
    }
    data.project_id = !isEmpty(data.project_id) ? data.project_id : "";
    if (typeof data.deprecated === "boolean") {
      data.deprecated = data.deprecated;
    } else {
      errors.deprecated = "Deprecated is required";
    }

    if (isEmpty(data.title)) {
      errors.title = "Title id required";
    } else {
      if (data.title.length > titleLimit) {
        errors.title = `Title can not be more than ${titleLimit} long (${data.title.length})`;
      }
    }
    if (create_environment) {
      if (isEmpty(data.project_id)) {
        errors.project_id = "Project id is required";
      } else {
        if (isNaN(data.project_id)) {
          errors.project_id = "Project id is not a valid number";
        }
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
};
