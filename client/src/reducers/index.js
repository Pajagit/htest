import { combineReducers } from "redux";

import testcaseReducer from "./testcaseReducer";
import groupReducer from "./groupReducer";
import authReducer from "./authReducer";

export default combineReducers({
  testcases: testcaseReducer,
  groups: groupReducer,
  auth: authReducer
});
