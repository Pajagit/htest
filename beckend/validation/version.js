const isEmpty = require("./is-empty");

module.exports = {
  validateGetVersions: function(data) {
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
  validateVersionInput: function(data, create_version) {
    var errors = {};

    var versionLimit = 150;

    data.version = !isEmpty(data.version) ? data.version : "";
    data.used = !isEmpty(data.used) ? data.used : "";
    data.project_id = !isEmpty(data.project_id) ? data.project_id : "";
    if (typeof data.deprecated === "boolean") {
      data.deprecated = data.deprecated;
    } else {
      errors.deprecated = "Deprecated is required";
    }

    if (isEmpty(data.version)) {
      errors.version = "Version is required";
    } else {
      if (data.version.length > versionLimit) {
        errors.version = `Version can not be more than ${versionLimit} long (${data.version.length})`;
      }
    }
    if (create_version) {
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
