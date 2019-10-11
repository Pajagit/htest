import roles from "../roles/roles";

import isEmpty from "../validation/isEmpty";

// Restricting access based on token projects
export const testcasesPermissions = (userProjects, projectId, superadmin) => {
  var filteredProjects = userProjects.filter(function(project) {
    return project.id === parseInt(projectId);
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

// Restricting access based on token projects
export const addTestcasesPermissions = (userProjects, projectId, superadmin) => {
  var filteredProjects = userProjects.filter(function(project) {
    return project.id === parseInt(projectId);
  });

  var errors = {};
  if (filteredProjects.length > 0) {
    var roleOnProject = filteredProjects[0].role.title;

    if (roleOnProject === roles.VIEWER) {
      errors.invalid_access = true;
    }
  }
  if (superadmin) {
    errors = {};
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
