import isEmpty from "../validation/isEmpty";
const BrowserValidation = data => {
  var errors = {};

  var titleLimit = 150;
  var screenResolutionLimit = 150;
  var versionLimit = 150;

  data.title = !isEmpty(data.title) ? data.title : "";
  data.screen_resolution = !isEmpty(data.screen_resolution) ? data.screen_resolution : "";
  data.version = !isEmpty(data.version) ? data.version : "";

  if (isEmpty(data.title)) {
    errors.title = "Title id required";
  } else {
    if (data.title.length > titleLimit) {
      errors.title = `Title can not be more than ${titleLimit} long (${data.title.length})`;
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
};

export default BrowserValidation;
