const isEmpty = require("./is-empty");

module.exports = {
  validateGetBrowsers: function(data) {
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
  validateBrowserInput: function(data, create_browser) {
    var errors = {};

    var titleLimit = 150;
    var screenResolutionLimit = 150;
    var versionLimit = 150;

    data.title = !isEmpty(data.title) ? data.title : "";
    data.screen_resolution = !isEmpty(data.screen_resolution) ? data.screen_resolution : "";
    data.version = !isEmpty(data.version) ? data.version : "";
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
    if (create_browser) {
      if (isEmpty(data.project_id)) {
        errors.project_id = "Project id is required";
      } else {
        if (isNaN(data.project_id)) {
          errors.project_id = "Project id is not a valid number";
        }
      }
    }

    if (!isEmpty(data.version) && data.version.length > versionLimit) {
      errors.version = `Version can not be more than ${versionLimit} long (${data.version.length})`;
    }

    if (!isEmpty(data.screen_resolution) && data.screen_resolution.length > screenResolutionLimit) {
      errors.screen_resolution = `Screen resolution can not be more than ${screenResolutionLimit} long (${data.screen_resolution.length})`;
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
};
