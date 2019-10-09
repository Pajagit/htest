import roles from "../roles/roles";

import isEmpty from "../validation/isEmpty";

// Restricting all roles except SuperAdmin to access CreateProject page
export const createNewProjectPermission = userProjects => {
  var filteredProjects = userProjects.filter(function(project) {
    return project.role === roles.SUPERADMIN;
  });
  var errors = {};
  if (filteredProjects.length === 0) {
    errors.invalid_access = true;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

// Restricting all roles except SuperAdmin to access ProjectSettings page
export const projectSettingsPermission = userProjects => {
  var filteredProjects = userProjects.filter(function(project) {
    return project.role === roles.SUPERADMIN;
  });
  var errors = {};
  if (filteredProjects.length === 0) {
    errors.invalid_access = true;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
