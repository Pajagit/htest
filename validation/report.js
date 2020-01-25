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

    if (!isEmpty(data.browser_id)) {
      if (isNaN(data.browser_id)) {
        errors.browser_id = "Browser id is not a valid number";
      }
    }

    if (!isEmpty(data.environment_id)) {
      if (isNaN(data.environment_id)) {
        errors.environment_id = "Environment id is not a valid number";
      }
    }

    if (!isEmpty(data.device_id)) {
      if (isNaN(data.device_id)) {
        errors.device_id = "Device id is not a valid number";
      }
    }

    if (!isEmpty(data.simulator_id)) {
      if (isNaN(data.simulator_id)) {
        errors.simulator_id = "Simulator id is not a valid number";
      }
    }

    if (!isEmpty(data.operating_system_id)) {
      if (isNaN(data.operating_system_id)) {
        errors.operating_system_id = "Operating system id is not a valid number";
      }
    }

    if (!isEmpty(data.version_id)) {
      if (isNaN(data.version_id)) {
        errors.version_id = "Version id is not a valid number";
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  },
  validateGetReports: function(data) {
    var errors = {};

    if (!isEmpty(data.page) && isNaN(data.page)) {
      errors.page = "Page is not a valid number";
    }

    if (!isEmpty(data.page_size) && isNaN(data.page_size)) {
      errors.page_size = "Page size is not a valid number";
    }
    if (isEmpty(data.project_id)) {
      errors.project_id = "Project id is required";
    } else {
      if (isNaN(data.project_id)) {
        errors.project_id = "Project id is not a valid number";
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
};
