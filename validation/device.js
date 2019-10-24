const isEmpty = require("./is-empty");

module.exports = {
  validateGetDevices: function(data) {
    var errors = {};

    if (!isEmpty(data.page) && isNaN(data.page)) {
      errors.page = "Page is not a valid number";
    }

    if (isEmpty(data.simulator)) {
      errors.page = "Simulator is required";
    } else {
      var arrayOfSimulatorValues = ["true", "false"];
      if (!arrayOfSimulatorValues.includes(data.simulator)) {
        errors.simulator = "Simulator can have one of these values [true, false]";
      }
    }

    if (!isEmpty(data.page_size) && isNaN(data.page_size)) {
      errors.page_size = "Page size is not a valid number";
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  },
  validateDeviceInput: function(data, isRealDevice) {
    var errors = {};

    var titleLimit = 150;
    var resolutionLimit = 150;
    var dpiLimit = 150;
    var udidLimit = 150;
    var screenSizeLimit = 150;

    data.title = !isEmpty(data.title) ? data.title : "";
    data.resolution = !isEmpty(data.resolution) ? data.resolution : "";
    data.dpi = !isEmpty(data.dpi) ? data.dpi : "";
    data.udid = !isEmpty(data.udid) ? data.udid : "";
    data.screen_size = !isEmpty(data.screen_size) ? data.screen_size : "";
    data.retina = data.retina;
    data.office_id = !isEmpty(data.office_id) ? data.office_id : "";
    data.simulator = data.simulator;

    if (isEmpty(data.title)) {
      errors.title = "Title id required";
    } else {
      if (data.title.length > titleLimit) {
        errors.title = `Title can not be more than ${titleLimit} long (${data.title.length})`;
      }
    }
    if (isEmpty(data.operating_system_id)) {
      errors.operating_system_id = "Operating system id required";
    } else {
      if (isNaN(data.operating_system_id)) {
        errors.operating_system_id = "Operating system id is not a valid number";
      }
    }

    if (!isEmpty(data.resolution) && data.resolution.length > resolutionLimit) {
      errors.resolution = `Resolution can not be more than ${resolutionLimit} long (${data.resolution.length})`;
    }

    if (!isEmpty(data.dpi) && data.dpi.length > dpiLimit) {
      errors.dpi = `Dpi can not be more than ${dpiLimit} long (${data.dpi.length})`;
    }

    if (!isEmpty(data.udid) && data.udid.length > udidLimit) {
      errors.udid = `UDID can not be more than ${udidLimit} long (${data.udid.length})`;
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

    if (isRealDevice) {
      if (isEmpty(data.office_id)) {
        errors.office_id = "Office is required";
      } else {
        if (isNaN(data.office_id)) {
          errors.office_id = "Office id is not a valid number";
        }
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
};
