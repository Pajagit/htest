import { combineReducers } from "redux";

import testcaseReducer from "./testcaseReducer";
import groupReducer from "./groupReducer";

export default combineReducers({
  testcases: testcaseReducer,
  groups: groupReducer
});
