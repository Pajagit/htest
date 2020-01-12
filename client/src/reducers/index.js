import { combineReducers } from "redux";

import errorReducer from "./errorReducer";
import testcaseReducer from "./testcaseReducer";
import groupReducer from "./groupReducer";
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import projectReducer from "./projectReducer";
import roleReducer from "./roleReducer";
import settingReducer from "./settingReducer";
import deviceReducer from "./deviceReducer";
import browserReducer from "./browserReducer";
import simulatorReducer from "./simulatorReducer";
import officeReducer from "./officeReducer";
import versionReducer from "./versionReducer";
import environmentReducer from "./environmentReducer";
import mobileOsReducer from "./mobileOsReducer";
import testSetupReducer from "./testSetupReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  testcases: testcaseReducer,
  groups: groupReducer,
  users: userReducer,
  projects: projectReducer,
  roles: roleReducer,
  settings: settingReducer,
  devices: deviceReducer,
  simulators: simulatorReducer,
  offices: officeReducer,
  mobileOSs: mobileOsReducer,
  browsers: browserReducer,
  versions: versionReducer,
  environments: environmentReducer,
  testSetup: testSetupReducer
});
