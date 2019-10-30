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
    data.is_supported = !isEmpty(data.is_supported) ? data.is_supported : "";
    data.support_stopped_at = !isEmpty(data.support_stopped_at) ? data.support_stopped_at : "";
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
    }

    if (isEmpty(data.is_supported)) {
      errors.is_supported = "Is supported is required";
    }
    if (!isEmpty(data.is_supported)) {
      if (typeof data.is_supported !== "boolean") {
        errors.is_supported = "Parameter 'is_supported' must have a true or false value";
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
};
