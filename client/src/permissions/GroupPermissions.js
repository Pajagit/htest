import roles from "../roles/roles";

import isEmpty from "../validation/isEmpty";

// Restricting all roles except SuperAdmin and Admin to access CreateNewGroup page
export const createNewGroupPermission = (userProjects, projectId) => {
  var filteredProjects = userProjects.filter(function(project) {
    return project.id === parseInt(projectId);
  });
  var errors = {};
  var roleOnProject = filteredProjects[0].role.title;
  if (roleOnProject !== roles.PROJECTADMIN && roleOnProject !== roles.SUPERADMIN) {
    errors.invalid_access = true;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

// Restricting all roles except SuperAdmin and Admin to access Groups page
export const groupsPermission = (userProjects, projectId) => {
  var filteredProjects = userProjects.filter(function(project) {
    return project.id === parseInt(projectId);
  });
  var errors = {};
  var roleOnProject = filteredProjects[0].role.title;
  if (roleOnProject !== roles.PROJECTADMIN && roleOnProject !== roles.SUPERADMIN) {
    errors.invalid_access = true;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

// Disabling option for all roles except SuperAdmin and Admin to see project settings
export const projectPanelSettingsPermission = (userProjects, projectId, superadmin) => {
  var filteredProjects = userProjects.filter(function(project) {
    return project.id === parseInt(projectId);
  });
  console.log(superadmin);
  var errors = {};
  if (filteredProjects.length > 0) {
    var roleOnProject = filteredProjects[0].role.title;

    if (roleOnProject !== roles.PROJECTADMIN && !superadmin) {
      errors.invalid_access = true;
    }
  } else if (superadmin) {
    errors = {};
  } else {
    errors.invalid_access = true;
  }
  console.log(errors);
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
