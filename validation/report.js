const isEmpty = require("./is-empty");

module.exports = {
  validateReportInput: function(data) {
    var errors = {};

    var actualResultLimit = 1000;
    var commentLimit = 1000;
    var additionalPreconditionLimit = 1000;

    if (!isEmpty(data.actual_result)) {
      if (data.actual_result.length > actualResultLimit) {
        errors.actual_result = `Actual result can not be more than ${actualResultLimit} long (${data.actual_result.length})`;
      }
    }

    if (!isEmpty(data.comment)) {
      if (data.comment.length > commentLimit) {
        errors.comment = `Comment can not be more than ${commentLimit} long (${data.comment.length})`;
      }
    }

    if (!isEmpty(data.additional_precondition)) {
      if (data.additional_precondition.length > additionalPreconditionLimit) {
        errors.additional_precondition = `Additional precondition can not be more than ${additionalPreconditionLimit} long (${data.additional_precondition.length})`;
      }
    }

    if (isEmpty(data.test_case_id)) {
      errors.test_case_id = "Test case id is required";
    } else {
      if (isNaN(data.test_case_id)) {
        errors.test_case_id = "Test case id is not a valid number";
      }
    }

    if (isEmpty(data.status_id)) {
      errors.status_id = "Status id is required";
    } else {
      if (isNaN(data.status_id)) {
        errors.status_id = "Status id is not a valid number";
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
};
