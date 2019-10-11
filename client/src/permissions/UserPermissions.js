import roles from "../roles/roles";

import isEmpty from "../validation/isEmpty";

// Restricting all roles except SuperAdmin to access EditUser page
export const globalEditUserPermission = (userProjects, superadmin) => {
  var filteredProjects = userProjects.filter(function(project) {
    return project.role === roles.SUPERADMIN;
  });
  var errors = {};
  if (filteredProjects.length === 0 && !superadmin) {
    errors.invalid_access = true;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

// Restricting all roles except SuperAdmin to access AddUser page
export const globalAddUserPermission = (userProjects, superadmin) => {
  var filteredProjects = userProjects.filter(function(project) {
    return project.role === roles.SUPERADMIN;
  });
  var errors = {};
  if (filteredProjects.length === 0 && !superadmin) {
    errors.invalid_access = true;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

// Restricting all roles except SuperAdmin to access UserSettings page
export const globalUsersPermissions = (userProjects, superadmin) => {
  var filteredProjects = userProjects.filter(function(project) {
    return project.role === roles.SUPERADMIN;
  });
  var errors = {};
  if (filteredProjects.length === 0 && !superadmin) {
    errors.invalid_access = true;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
