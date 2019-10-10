import roles from "../roles/roles";

import isEmpty from "../validation/isEmpty";

// Restricting all roles except SuperAdmin to access EditUser page
export const globalEditUserPermission = userProjects => {
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

// Restricting all roles except SuperAdmin to access AddUser page
export const globalAddUserPermission = userProjects => {
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

// Restricting all roles except SuperAdmin to access UserSettings page
export const globalUsersPermissions = userProjects => {
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
