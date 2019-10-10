// import roles from "../roles/roles";

import isEmpty from "../validation/isEmpty";

// Restricting access based on token projects
export const testcasesPermissions = (userProjects, projectId) => {
  var filteredProjects = userProjects.filter(function(project) {
    return project.id === parseInt(projectId);
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
