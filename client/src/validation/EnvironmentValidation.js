import isEmpty from "../validation/isEmpty";
const EnvironmentValidation = data => {
  var errors = {};

  var titleLimit = 150;

  data.title = !isEmpty(data.title) ? data.title : "";
  data.used = !isEmpty(data.used) ? data.used : "";

  if (isEmpty(data.title)) {
    errors.title = "Title is required";
  } else {
    if (data.title.length > titleLimit) {
      errors.title = `Title can not be more than ${titleLimit} long (${data.title.length})`;
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default EnvironmentValidation;
