import isEmpty from "../validation/isEmpty";

const VersionValidation = data => {
  var errors = {};

  var versionLimit = 150;

  data.version = !isEmpty(data.version) ? data.version : "";
  data.is_supported = !isEmpty(data.is_supported) ? data.is_supported : "";
  data.support_stopped_at = !isEmpty(data.support_stopped_at) ? data.support_stopped_at : "";
  data.project_id = !isEmpty(data.project_id) ? data.project_id : "";

  if (isEmpty(data.version)) {
    errors.version = "Version id required";
  } else {
    if (data.version.length > versionLimit) {
      errors.version = `Version can not be more than ${versionLimit} long (${data.version.length})`;
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
};

export default VersionValidation;
