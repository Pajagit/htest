import isEmpty from "../validation/isEmpty";
const ReportValidation = data => {
  var errors = {};

  var titleLimit = 150;
  var screenResolutionLimit = 150;
  var additionalPreconditionLimit = 1000;
  var actualResultLimit = 1000;
  var commentLimit = 1000;

  //   data.title = !isEmpty(data.title) ? data.title : "";
  //   data.screen_resolution = !isEmpty(data.screen_resolution) ? data.screen_resolution : "";
  //   data.version = !isEmpty(data.version) ? data.version : "";
  //   data.deprecated = !isEmpty(data.deprecated) ? data.deprecated : "";

  if (isEmpty(data.status_id)) {
    errors.status = "Status is required";
  }
  //    else {
  //     if (data.title.length > titleLimit) {
  //       errors.title = `Title can not be more than ${titleLimit} long (${data.title.length})`;
  //     }
  //   }

  if (!isEmpty(data.additional_precondition) && data.additional_precondition.length > additionalPreconditionLimit) {
    errors.additional_precondition = `Report precondition can not be more than ${additionalPreconditionLimit} long (${data.additional_precondition.length})`;
  }
  if (!isEmpty(data.actual_result) && data.actual_result.length > actualResultLimit) {
    errors.actual_result = `Actual result can not be more than ${actualResultLimit} long (${data.actual_result.length})`;
  }
  if (!isEmpty(data.comment) && data.comment.length > commentLimit) {
    errors.comment = `Actual result can not be more than ${commentLimit} long (${data.comment.length})`;
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
