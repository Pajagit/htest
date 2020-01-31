const isEmpty = require("./is-empty");
module.exports = {
  validateRouteGroupId: function(data) {
    var errors = {};
    if (isNaN(data.id)) {
      errors.message = "Group id is not valid number";
    }
    return {
      errors,
      isValid: isEmpty(errors)
    };
  },
  validateGroupInput: function(data, insert) {
    var titleLimit = 255;

    var errors = {};

    data.title = !isEmpty(data.title) ? data.title : null;
    data.pinned = !isEmpty(data.pinned) ? data.pinned : null;
    data.project_id = !isEmpty(data.project_id) ? data.project_id : null;

    // Title validation
    if (isEmpty(data.title)) {
      errors.title = "Title is a required field";
    } else {
      if (data.title.length > titleLimit) {
        errors.title = `Title can not be more than ${titleLimit} long (${data.title.length})`;
      }
    }

    // Project id validation
    if (insert && isEmpty(data.project_id)) {
      errors.project_id = "Project id is a required field";
    } else {
      if (insert && isNaN(data.project_id)) {
        errors.project_id = "Project id is not valid number";
      }
    }

    //Pinned validation
    if (!isEmpty(data.pinned)) {
      if (typeof data.pinned !== "boolean") {
        errors.pinned = "Parameter 'pinned' must have a true or false value";
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  },
  validateRouteProjectId: function(data) {
    var errors = {};
    if (isEmpty(data.project_id)) {
      errors.message = "Project id is required";
    } else {
      if (isNaN(data.project_id)) {
        errors.message = "Project id is not valid number";
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
};
