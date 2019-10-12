import { combineReducers } from "redux";

import errorReducer from "./errorReducer";
import testcaseReducer from "./testcaseReducer";
import groupReducer from "./groupReducer";
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import projectReducer from "./projectReducer";
import roleReducer from "./roleReducer";
import settingReducer from "./settingReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  testcases: testcaseReducer,
  groups: groupReducer,
  users: userReducer,
  projects: projectReducer,
  roles: roleReducer,
  settings: settingReducer
});
