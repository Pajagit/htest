const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = {
  validateTestCaseInput: function(data) {
    var titleLimit = 150;
    var descriptionLimit = 1000;
    var testStepLimit = 150;
    var expectedResultLimit = 150;
    var preconditionLimit = 150;
    var linkLimit = 150;

    var errors = {};

    data.title = !isEmpty(data.title) ? data.title : "";
    data.preconditions = !isEmpty(data.preconditions) ? data.preconditions : "";
    data.description = !isEmpty(data.description) ? data.description : "";
    data.expected_result = !isEmpty(data.expected_result) ? data.expected_result : "";

    // Title validation
    if (isEmpty(data.title)) {
      errors.title = "Title is a required field";
    }
    if (data.title.length > titleLimit) {
      errors.title = `Title can not be more than ${titleLimit} long (${data.title.length})`;
    }

    // Project id validation
    if (isEmpty(data.project_id)) {
      errors.project_id = "Project id is a required field";
    }

    // Description validation
    if (isEmpty(data.description)) {
      errors.description = "Description is a required field";
    }

    if (data.description.length > descriptionLimit) {
      errors.description = `Description can not be more than ${descriptionLimit} long (${data.description.length})`;
    }

    // Test steps validation
    if (data.test_steps.length < 1) {
      errors.test_steps = "There must be at least one test step";
    } else {
      var empty = true;
      for (var i = 0; i < data.test_steps.length; i++) {
        if (data.test_steps[i].value.trim().length > 0) {
          empty = false;
          if (data.test_steps[i].value.trim().length > testStepLimit) {
            errors.test_steps = `Test step can not be more than ${testStepLimit} long (${data.test_steps[i].length})`;
          }
        }
      }
      if (empty) {
        errors.test_steps = "There must be at least one test step";
      }
    }

    // Expected result validation
    if (isEmpty(data.expected_result)) {
      errors.expected_result = "Expected result is a required field";
    }

    if (data.expected_result.length > expectedResultLimit) {
      errors.expected_result = `Expected result can not be more than ${expectedResultLimit} long (${data.expected_result.length})`;
    }

    // Groups validation
    if (isEmpty(data.groups)) {
      errors.groups = "Test case must be assigned to at least one group";
    } else {
      var invalid_format = false;
      for (var i = 0; i < data.groups.length; i++) {
        if (isNaN(data.groups[i]) || isEmpty(data.groups[i])) {
          invalid_format = true;
        }
      }
      if (invalid_format) {
        errors.groups = "Group is not a valid number";
      }
    }

    // Preconditions validation
    if (data.preconditions.length > preconditionLimit) {
      errors.preconditions = `Preconditions can not be more than ${preconditionLimit} long (${data.preconditions.length})`;
    }

    // Links validation
    if (!isEmpty(data.links)) {
      for (var i = 0; i < data.links.length; i++) {
        if (data.links[i].trim().length > linkLimit) {
          errors.links = `Link can not be more than ${linkLimit} long (${data.links[i].length})`;
        }
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  },
  validateTestCaseFilter: function(data) {
    data.groups = !isEmpty(data.groups) ? data.groups : [];
    data.users = !isEmpty(data.users) ? data.users : [];
    data.dateFrom = !isEmpty(data.date_from) ? data.date_from : "";
    data.dateTo = !isEmpty(data.date_to) ? data.date_to : "";
    data.page = !isEmpty(data.page) ? data.page : "";
    data.page_size = !isEmpty(data.page_size) ? data.page_size : "";

    var errors = {};

    var invalid_format = false;
    for (var i = 0; i < data.groups.length; i++) {
      if (isNaN(data.groups[i]) || isEmpty(data.groups[i])) {
        invalid_format = true;
      }
    }
    if (invalid_format) {
      errors.groups = "Group id is not a valid number";
    }

    var invalid_format_users = false;
    for (var i = 0; i < data.users.length; i++) {
      if (isNaN(data.users[i])) {
        invalid_format_users = true;
      }
    }
    if (invalid_format_users) {
      errors.users = "User id is not a valid number";
    }

    if (!isEmpty(data.page) && isNaN(data.page)) {
      errors.page = "Page is not a valid number";
    }

    if (isEmpty(data.page_size) && isNaN(data.page_size)) {
      errors.page_size = "Page size is not a valid number";
    }

    return { errors, isValid: isEmpty(errors) };
  }
};
