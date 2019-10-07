import React from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import PrivateRoute from "./components/common/PrivateRoute";
import setAuthToken from "./actions/setAuthToken";
import store from "./store";
import NewTestCase from "./components/test-cases/NewTestCase";
import TestCases from "./components/test-cases/TestCases";
import Reports from "./components/reports/Reports";
import Statistics from "./components/statistics/Statistics";
import ProjectSettingsPage from "./components/project-settings/ProjectSettings";
import Landing from "./pages/Landing";
import Projects from "./components/project/Projects";
import EditProject from "./components/project/EditProject";
import NewProject from "./components/project/NewProject";
import UserSettings from "./components/global-settings/UserSettings";
import AddUser from "./components/users/AddUser";
import EditUser from "./components/users/EditUser";
import ProjectSettings from "./components/global-settings/ProjectSettings";
import DeviceSettings from "./components/global-settings/DeviceSettings";
import TestCase from "./components/test-cases/TestCase";
import NewGroup from "./components/groups/NewGroup";
import EditGroup from "./components/groups/EditGroup";
import Groups from "./components/groups/Groups";
import EditTestCase from "./components/test-cases/EditTestCase";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import "./sass/main.scss";

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
          <PrivateRoute exact path="/:projectId/TestCase/:testcaseId" component={TestCase} />
          <PrivateRoute exact path="/:projectId/CreateTestCase" component={NewTestCase} />
          <PrivateRoute exact path="/:projectId/EditTestCase/:testcaseId" component={EditTestCase} />
          <PrivateRoute exact path="/:projectId/TestCases" component={TestCases} />
          <PrivateRoute exact path="/:projectId/Reports" component={Reports} />
          <PrivateRoute exact path="/:projectId/Statistics" component={Statistics} />
          <PrivateRoute exact path="/:projectId/Settings" component={ProjectSettingsPage} />
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
        </div>
      </Router>
    </Provider>
  );
}

export default App;
