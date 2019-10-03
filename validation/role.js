const isEmpty = require("./is-empty");

module.exports = {
  validateRoleInput: function(data) {
    var titleLimit = 255;

    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : "";

    // Title validation
    if (isEmpty(data.title)) {
      errors.title = "Title is a required field";
    }
    if (data.title.length > titleLimit) {
      errors.title = `Title can not be more than ${titleLimit} long (${data.title.length})`;
    }
    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
};
