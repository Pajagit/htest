import React from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import PrivateRoute from "./components/common/PrivateRoute";
import setAuthToken from "./actions/setAuthToken";
import store from "./store";
import NewTestCase from "./pages/project/test-cases/NewTestCase";
import TestCases from "./pages/project/test-cases/TestCases";
import Reports from "./pages/project/reports/Reports";
import Statistics from "./pages/project/statistics/Statistics";
// import ProjectSettingsPage from "./components/project-settings/ProjectSettings";
import Landing from "./pages/Landing";
import Projects from "./pages/global/projects/Projects";
import EditProject from "./pages/global/global-settings/projects/EditProject";
import NewProject from "./pages/global/global-settings/projects/NewProject";
import UserSettings from "./pages/global/global-settings/UserSettings";
import AddUser from "./pages/global/global-settings/users/AddUser";
import EditUser from "./pages/global/global-settings/users/EditUser";
import ProjectSettings from "./pages/global/global-settings/ProjectSettings";
import DeviceSettings from "./pages/global/global-settings/DeviceSettings";
import TestCase from "./pages/project/test-cases/TestCase";
import NewGroup from "./pages/project/settings/groups/NewGroup";
import EditGroup from "./pages/project/settings/groups/EditGroup";
import Groups from "./pages/project/settings/groups/Groups";
import ProjectInfo from "./pages/project/settings/ProjectInfo";
import Devices from "./pages/project/settings/devices/Devices";
import Browsers from "./pages/project/settings/browsers/Browsers";
import Versions from "./pages/project/settings/versions/Versions";
import Environments from "./pages/project/settings/environments/Environments";
import TestSetup from "./pages/project/settings/test-setup/TestSetup";
import EditTestCase from "./pages/project/test-cases/EditTestCase";
import Notifications from "./pages/global/notifications/Notifications";
import GlobalStatistics from "./pages/global/statistics/GlobalStatistics";
import NewDevice from "./pages/global/global-settings/devices/NewDevice";
import EditDevice from "./pages/global/global-settings/devices/EditDevice";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "./sass/main.scss";

import openSocket from "socket.io-client";
import webSocket from "./configSocket/keys";
var socket = openSocket(webSocket.webSocket);

socket.on("refreshUserToken", function(data) {
  if (localStorage.jwtHtestToken) {
    const decoded = jwt_decode(localStorage.jwtHtestToken);
    if (decoded.id === parseInt(data)) {
      var refreshTokenCrypted = localStorage.getItem("jwtHtestRefreshToken");
      let refreshTokenObj = {
        refreshToken: refreshTokenCrypted
      };
      axios
        .post("/api/token", refreshTokenObj)
        .then(res => {
          // Save to localStorage
          const { token, refreshToken } = res.data;
          // Set token to ls
          localStorage.setItem("jwtHtestToken", token);
          localStorage.setItem("jwtHtestRefreshToken", refreshToken);
          // Set token to Auth header
          setAuthToken(token);
          // Decode token to get user data
          const decoded = jwt_decode(token);
          // Set current user
          store.dispatch(setCurrentUser(decoded));
        })
        .catch(err => {
          store.dispatch(logoutUser());
        });
    }
  }
});

// Check for token
if (localStorage.jwtHtestToken) {
  const currentTime = Date.now() / 1000;
  // Set auth token header auth
  setAuthToken(localStorage.jwtHtestToken);
  var refreshTokenCrypted = localStorage.getItem("jwtHtestRefreshToken");
  let refreshTokenObj = {
    refreshToken: refreshTokenCrypted
  };
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtHtestToken);
  if (decoded.exp < currentTime - 10) {
    axios
      .post("/api/token", refreshTokenObj)
      .then(res => {
        // Save to localStorage
        const { token, refreshToken } = res.data;
        // Set token to ls
        localStorage.setItem("jwtHtestToken", token);
        localStorage.setItem("jwtHtestRefreshToken", refreshToken);
        // Set token to Auth header
        setAuthToken(token);
        // Decode token to get user data
        const decoded = jwt_decode(token);
        // Set current user
        store.dispatch(setCurrentUser(decoded));
      })
      .catch(err => {
        store.dispatch(logoutUser());
      });
  } else {
    store.dispatch(setCurrentUser(decoded));
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <div>
            <ToastContainer transition={Flip} position="bottom-right" />
          </div>
          <Route exact path="/" component={Landing} />
          <PrivateRoute exact path="/Projects" component={Projects} />
          <PrivateRoute exact path="/:projectId/ProjectInfo" component={ProjectInfo} />
          <PrivateRoute exact path="/:projectId/TestCase/:testcaseId" component={TestCase} />
          <PrivateRoute exact path="/:projectId/CreateTestCase" component={NewTestCase} />
          <PrivateRoute exact path="/:projectId/EditTestCase/:testcaseId" component={EditTestCase} />
          <PrivateRoute exact path="/:projectId/TestCases" component={TestCases} />
          <PrivateRoute exact path="/:projectId/Reports" component={Reports} />
          <PrivateRoute exact path="/:projectId/Statistics" component={Statistics} />
          {/* <PrivateRoute exact path="/:projectId/Settings" component={ProjectSettingsPage} /> */}
          <PrivateRoute exact path="/UserSettings" component={UserSettings} />
          <PrivateRoute exact path="/AddUser" component={AddUser} />
          <PrivateRoute exact path="/ProjectSettings" component={ProjectSettings} />
          <PrivateRoute exact path="/DeviceSettings" component={DeviceSettings} />
          <PrivateRoute exact path="/EditUser/:userId" component={EditUser} />
          <PrivateRoute exact path="/EditProject/:projectId" component={EditProject} />
          <PrivateRoute exact path="/CreateProject" component={NewProject} />
          <PrivateRoute exact path="/:projectId/CreateNewGroup" component={NewGroup} />
          <PrivateRoute exact path="/:projectId/EditGroup/:groupId" component={EditGroup} />
          <PrivateRoute exact path="/:projectId/Groups" component={Groups} />
          <PrivateRoute exact path="/:projectId/Devices" component={Devices} />
          <PrivateRoute exact path="/:projectId/Browsers" component={Browsers} />
          <PrivateRoute exact path="/:projectId/Versions" component={Versions} />
          <PrivateRoute exact path="/:projectId/Environments" component={Environments} />
          <PrivateRoute exact path="/:projectId/TestSetup" component={TestSetup} />
          <PrivateRoute exact path="/Notifications" component={Notifications} />
          <PrivateRoute exact path="/Statistics" component={GlobalStatistics} />
          <PrivateRoute exact path="/AddDevice" component={NewDevice} />
          <PrivateRoute exact path="/EditDevice/:deviceId" component={EditDevice} />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
