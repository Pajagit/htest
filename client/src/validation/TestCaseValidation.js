import validator from "validator";
import isEmpty from "../validation/isEmpty";
const TestCaseValidation = testCase => {
  var titleLimit = 150;
  var descriptionLimit = 1000;
  var testStepLimit = 150;
  var expectedResultLimit = 150;
  var preconditionLimit = 150;
  var linkLimit = 150;

  var errors = {};
  // Title validation
  if (isEmpty(testCase.title)) {
    errors.title = "Title is a required field";
  }
  if (testCase.title.length > titleLimit) {
    errors.title = `Title can not be more than ${titleLimit} long (${testCase.title.length})`;
  }

  // Description validation
  if (isEmpty(testCase.description)) {
    errors.description = "Description is a required field";
  }

  if (testCase.description.length > descriptionLimit) {
    errors.description = `Description can not be more than ${descriptionLimit} long (${testCase.description.length})`;
  }

  // Test steps validation
  if (isEmpty(testCase.test_steps)) {
    errors.test_steps = "There must be at least one test step";
  }

  var filteredTestSteps = testCase.test_steps.filter(function(test_step) {
    return test_step.value !== "";
  });

  var filteredTestStepsLimit = testCase.test_steps.filter(function(test_step) {
    return test_step !== "" && test_step.length > testStepLimit;
  });

  if (filteredTestSteps.length === 0) {
    errors.test_steps = `There must be at least one test step`;
  } else if (filteredTestStepsLimit.length > 0) {
    var longStepValue = `"${filteredTestStepsLimit[0].substring(0, 20)}"`;

    errors.test_steps = `${longStepValue}... test step is too long and can have more than ${testStepLimit} characters (${filteredTestStepsLimit[0].length})`;
  }

  // Expected result validation
  if (isEmpty(testCase.expected_result)) {
    errors.expected_result = "Expected result is a required field";
  }

  if (testCase.expected_result.length > expectedResultLimit) {
    errors.expected_result = `Expected result can not be more than ${expectedResultLimit} long (${testCase.expected_result.length})`;
  }
  // Groups validation
  if (isEmpty(testCase.groups)) {
    errors.groups = "Test case must be assigned to at least one group";
  }

  // Preconditions validation
  if (testCase.preconditions.length > preconditionLimit) {
    errors.preconditions = `Expected result can not be more than ${preconditionLimit} long (${testCase.preconditions.length})`;
  }

  // Links validation
  var filteredLinksLimit = testCase.links.filter(function(link) {
    return link !== "" && link.length > linkLimit;
  });

  if (filteredLinksLimit.length > 0) {
    var longLinkValue = `"${filteredLinksLimit[0].substring(0, 20)}"`;

    errors.links = `${longLinkValue}... test step is too long and can have more than ${linkLimit} characters (${filteredLinksLimit[0].length})`;
  }
  var options = {
    protocols: ["http", "https", "ftp"],
    require_tld: true,
    require_protocol: true,
    require_host: true,
    require_valid_protocol: true,
    allow_underscores: false,
    host_whitelist: false,
    host_blacklist: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
    disallow_auth: false
  };
  var filteredLinkUrl = testCase.links.filter(function(link) {
    return validator.isURL(link, options) === false;
  });
  if (filteredLinkUrl.length > 0) {
    var invalidLinkValue = `"${filteredLinkUrl[0].substring(0, 20)}"`;

    errors.links = `${invalidLinkValue}... link is invalid`;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
export default TestCaseValidation;
