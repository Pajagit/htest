import { combineReducers } from "redux";

import testcaseReducer from "./testcaseReducer";

export default combineReducers({
  testcases: testcaseReducer
});
