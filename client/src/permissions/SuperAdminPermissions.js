import roles from "../roles/roles";

import isEmpty from "../validation/isEmpty";

// Restricting all roles except SuperAdmin to access
export const superAdminPermissions = (users, superadmin) => {
  var filteredUsers = users.filter(function(user) {
    return user.role === roles.SUPERADMIN;
  });
  var errors = {};
  if (filteredUsers.length === 0 && !superadmin) {
    errors.invalid_access = true;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
