const isEmpty = require("./is-empty");

module.exports = {
  validateGetSimulator: function(data, dataBody) {
    var errors = {};

    if (!isEmpty(data.page) && isNaN(data.page)) {
      errors.page = "Page is not a valid number";
    }

    if (!isEmpty(data.page_size) && isNaN(data.page_size)) {
      errors.page_size = "Page size is not a valid number";
    }

    if (isEmpty(dataBody.project_id)) {
      errors.project_id = "Project id is a required field";
    } else {
      if (isNaN(dataBody.project_id)) {
        errors.project_id = "Project id is not valid number";
      }
    }

    if (dataBody.emulator !== true && dataBody.emulator !== false) {
      errors.emulator = "Parameter 'emulator' must have a true or false value";
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  },
  validateSimulatorInput: function(data, createSimulator) {
    var errors = {};

    var titleLimit = 150;
    var resolutionLimit = 150;
    var dpiLimit = 150;
    var screenSizeLimit = 150;

    data.title = !isEmpty(data.title) ? data.title : "";
    data.resolution = !isEmpty(data.resolution) ? data.resolution : "";
    data.dpi = !isEmpty(data.dpi) ? data.dpi : "";
    data.screen_size = !isEmpty(data.screen_size) ? data.screen_size : "";
    data.retina = data.retina;
    data.emulator = data.emulator;

    if (createSimulator) {
      if (isEmpty(data.project_id)) {
        errors.project_id = "Project id is a required field";
      } else {
        if (isNaN(data.project_id)) {
          errors.project_id = "Project id is not valid number";
        }
      }
    }

    if (isEmpty(data.title)) {
      errors.title = "Title id required";
    } else {
      if (data.title.length > titleLimit) {
        errors.title = `Title can not be more than ${titleLimit} long (${data.title.length})`;
      }
    }
    if (isEmpty(data.os)) {
      errors.os = "Operating system id required";
    }

    if (!isEmpty(data.resolution) && data.resolution.length > resolutionLimit) {
      errors.resolution = `Resolution can not be more than ${resolutionLimit} long (${data.resolution.length})`;
    }

    if (!isEmpty(data.dpi) && data.dpi.length > dpiLimit) {
      errors.dpi = `Dpi can not be more than ${dpiLimit} long (${data.dpi.length})`;
    }

    if (!isEmpty(data.screen_size) && data.screen_size.length > screenSizeLimit) {
      errors.screen_size = `Screen size can not be more than ${screenSizeLimit} long (${data.screen_size.length})`;
    }

    if (isEmpty(data.retina)) {
      errors.retina = "Retina is required";
    } else {
      if (typeof data.retina !== "boolean") {
        errors.retina = "Parameter 'retina' must have a true or false value";
      }
    }

    if (data.emulator !== true && data.emulator !== false) {
      errors.emulator = "Parameter 'emulator' must have a true or false value";
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
};
