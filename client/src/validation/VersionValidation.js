import isEmpty from "../validation/isEmpty";

const VersionValidation = data => {
  var errors = {};

  var versionLimit = 150;

  data.version = !isEmpty(data.version) ? data.version : "";
  data.deprecated = !isEmpty(data.deprecated) ? data.deprecated : "";
  data.used = !isEmpty(data.used) ? data.used : "";
  data.project_id = !isEmpty(data.project_id) ? data.project_id : "";

  if (isEmpty(data.version)) {
    errors.version = "Version required";
  } else {
    if (data.version.length > versionLimit) {
      errors.version = `Version can not be more than ${versionLimit} long (${data.version.length})`;
    }
  }

  if (isEmpty(data.deprecated)) {
    errors.deprecated = "Deprecated is required";
  }
  if (!isEmpty(data.deprecated)) {
    if (typeof data.deprecated !== "boolean") {
      errors.deprecated = "Parameter 'deprecated' must have a true or false value";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default VersionValidation;
