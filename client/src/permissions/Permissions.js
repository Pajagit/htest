import isEmpty from "../validation/isEmpty";
import roles from "../roles/roles";

// Restricting all roles except SuperAdmin to access
export const superAdminPermissions = superadmin => {
  var errors = {};
  if (!superadmin) {
    errors.invalid_access = true;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

// Restricting all roles except SuperAdmin and ProjectAdmin to access
export const superAndProjectAdminPermissions = (userProjects, projectId, superadmin) => {
  var filteredProjects = userProjects.filter(function(project) {
    return project.id === parseInt(projectId);
  });

  var errors = {};
  if (filteredProjects.length > 0) {
    var roleOnProject = filteredProjects[0].role.title;

    if ((roleOnProject === roles.VIEWER || roleOnProject === roles.QA) && !superadmin) {
      errors.invalid_access = true;
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

// Restricting access based on token projects and super admin role
export const projectIdAndSuperAdminPermission = (userProjects, projectId, superadmin) => {
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

// Restricting write based on token projects and super admin role
export const writePermissions = (userProjects, projectId, superadmin) => {
  var filteredProjects = userProjects.filter(function(project) {
    return project.id === parseInt(projectId);
  });

  var errors = {};
  if (filteredProjects.length > 0) {
    var roleOnProject = filteredProjects[0].role.title;

    if (roleOnProject === roles.VIEWER && !superadmin) {
      errors.invalid_access = true;
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
