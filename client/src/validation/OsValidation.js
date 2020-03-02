import isEmpty from "../validation/isEmpty";

const OsValidation = data => {
  var errors = {};

  var titleLimit = 150;

  data.title = !isEmpty(data.title) ? data.title : "";
  data.deprecated = !isEmpty(data.deprecated) ? data.deprecated : "";
  data.used = !isEmpty(data.used) ? data.used : "";
  data.project_id = !isEmpty(data.project_id) ? data.project_id : "";

  if (isEmpty(data.title)) {
    errors.title = "Title required";
  } else {
    if (data.title.length > titleLimit) {
      errors.title = `Title can not be more than ${titleLimit} long (${data.title.length})`;
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

export default OsValidation;
