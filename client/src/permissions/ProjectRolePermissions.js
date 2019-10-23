import roles from "../roles/roles";

import isEmpty from "../validation/isEmpty";

// Restricting all roles except SuperAdmin and Admin to access Groups page
export const projectAdminPermissions = (userProjects, projectId, superadmin) => {
  var filteredProjects = userProjects.filter(function(project) {
    return project.id === parseInt(projectId);
  });

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

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
