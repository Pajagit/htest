const isEmpty = require("./is-empty");

module.exports = {
  validateGetOss: function(data) {
    var errors = {};

    if (!isEmpty(data.page) && isNaN(data.page)) {
      errors.page = "Page is not a valid number";
    }

    if (!isEmpty(data.page_size) && isNaN(data.page_size)) {
      errors.page_size = "Page size is not a valid number";
    }
    if (isEmpty(data.project_id)) {
      errors.project_id = "Project id is required";
    } else {
      if (isNaN(data.project_id)) {
        errors.project_id = "Project id is not a valid number";
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  },
  validateOSInput: function(data, create_os) {
    var errors = {};

    var titleLimit = 150;

    data.title = !isEmpty(data.title) ? data.title : "";
    data.used = !isEmpty(data.used) ? data.used : "";
    data.project_id = !isEmpty(data.project_id) ? data.project_id : "";
    if (typeof data.deprecated === "boolean") {
      data.deprecated = data.deprecated;
    } else {
      errors.deprecated = "Deprecated is required";
    }

    if (isEmpty(data.title)) {
      errors.title = "Title is required";
    } else {
      if (data.title.length > titleLimit) {
        errors.title = `Title can not be more than ${titleLimit} long (${data.title.length})`;
      }
    }
    if (create_os) {
      if (isEmpty(data.project_id)) {
        errors.project_id = "Project id is required";
      } else {
        if (isNaN(data.project_id)) {
          errors.project_id = "Project id is not a valid number";
        }
      }
      if (isEmpty(data.used)) {
        errors.used = "Used is required";
      }
    }

    if (!isEmpty(data.used)) {
      if (typeof data.used !== "boolean") {
        errors.used = "Parameter 'used' must have a true or false value";
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
};
