import isEmpty from "../validation/isEmpty";
import validator from "validator";

const ReportValidation = data => {
  var errors = {};

  var additionalPreconditionLimit = 1000;
  var actualResultLimit = 1000;
  var commentLimit = 1000;
  var linkLimit = 150;
  var stepLimit = 255;

  if (isEmpty(data.status_id)) {
    errors.status = "Status is required";
  }

  if (!isEmpty(data.additional_precondition) && data.additional_precondition.length > additionalPreconditionLimit) {
    errors.additional_precondition = `Report precondition can not be more than ${additionalPreconditionLimit} long (${data.additional_precondition.length})`;
  }
  if (!isEmpty(data.actual_result) && data.actual_result.length > actualResultLimit) {
    errors.actual_result = `Actual result can not be more than ${actualResultLimit} long (${data.actual_result.length})`;
  }
  if (!isEmpty(data.comment) && data.comment.length > commentLimit) {
    errors.comment = `Actual result can not be more than ${commentLimit} long (${data.comment.length})`;
  }

  if (data.steps) {
    var filteredStepsLimit = data.steps.filter(function(step) {
      if (!isEmpty(step.input_data)) {
        return step.input_data.length > stepLimit;
      } else {
        return null;
      }
    });
    if (filteredStepsLimit.length > 0) {
      var longStepValue = `"${filteredStepsLimit[0].input_data.substring(0, 20)}"`;

      errors.step = `${longStepValue}... test step is too long and can have more than ${stepLimit} characters (${filteredStepsLimit[0].input_data.length})`;
    }
  }

  // Links validation
  var filteredLinksLimit = data.links.filter(function(link) {
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

  var filteredLinkUrl = data.links.filter(function(link) {
    return validator.isURL(link.value, options) === false;
  });

  if (filteredLinkUrl.length > 0) {
    var invalidLinkValue = `"${filteredLinkUrl[0].value.substring(0, 20)}"`;

    errors.links = `${invalidLinkValue}... link is invalid`;
  }

  //   if (!isEmpty(data.screen_resolution) && data.screen_resolution.length > screenResolutionLimit) {
  //     errors.screen_resolution = `Screen resolution can not be more than ${screenResolutionLimit} long (${data.screen_resolution.length})`;
  //   }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default ReportValidation;
