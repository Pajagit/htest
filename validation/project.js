const isEmpty = require("./is-empty");

module.exports = {
  validateRouteProjectId: function(data) {
    var errors = {};
    if (isNaN(data.id)) {
      errors.message = "Project id is not valid number";
    }
    return {
      errors,
      isValid: isEmpty(errors)
    };
  },
  validateProjectInput: function(data) {
    var titleLimit = 255;
    var descriptionLimit = 1000;
    var imageUrlLimit = 1000;
    var projectManagerLimit = 255;
    var jiraUrlLimit = 255;
    var urlLimit = 255;

    var errors = {};

    data.title = !isEmpty(data.title) ? data.title : "";
    data.description = !isEmpty(data.description) ? data.description : "";
    data.started_at = !isEmpty(data.started_at) ? data.started_at : "";
    data.ended_at = !isEmpty(data.ended_at) ? data.ended_at : "";
    data.image_url = !isEmpty(data.image_url) ? data.image_url : "";
    data.project_manager = !isEmpty(data.project_manager) ? data.project_manager : "";
    data.jira_url = !isEmpty(data.jira_url) ? data.jira_url : "";
    data.url = !isEmpty(data.url) ? data.url : "";

    // Title validation
    if (isEmpty(data.title)) {
      errors.title = "Title is a required field";
    }
    if (data.title.length > titleLimit) {
      errors.title = `Title can not be more than ${titleLimit} long (${data.title.length})`;
    }

    // Url validation
    if (isEmpty(data.url)) {
      errors.url = "Url is a required field";
    }

    if (data.url.length > urlLimit) {
      errors.url = `Url can not be more than ${urlLimit} long (${data.url.length})`;
    }

    if (data.description.length > descriptionLimit) {
      errors.description = `Description can not be more than ${descriptionLimit} long (${data.description.length})`;
    }

    // Image url validation
    if (data.image_url.length > imageUrlLimit) {
      errors.image_url = `Image url can not be more than ${imageUrlLimit} long (${data.image_url.length})`;
    }

    // Project manager validation
    if (data.project_manager.length > projectManagerLimit) {
      errors.project_manager = `Project manager can not be more than ${projectManagerLimit} long (${data.project_manager.length})`;
    }

    // Jira url validation
    if (data.jira_url.length > jiraUrlLimit) {
      errors.jira_url = `Jira url can not be more than ${jiraUrlLimit} long (${data.jira_url.length})`;
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
};
