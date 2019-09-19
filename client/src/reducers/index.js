import { combineReducers } from "redux";

import errorReducer from "./errorReducer";
import testcaseReducer from "./testcaseReducer";
import groupReducer from "./groupReducer";
import authReducer from "./authReducer";
import userReducer from "./userReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  testcases: testcaseReducer,
  groups: groupReducer,
  users: userReducer
});
