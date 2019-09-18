import React from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import PrivateRoute from "./components/common/PrivateRoute";
import setAuthToken from "./actions/setAuthToken";
import store from "./store";
import Test from "./pages/Test";
import NewTestCase from "./components/test-cases/NewTestCase";
import TestCases from "./components/test-cases/TestCases";
import Landing from "./pages/Landing";
import Projects from "./pages/Projects";
import TestCase from "./components/test-cases/TestCase";
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
          <Route exact path="/test" component={Test} />
          <Route exact path="/" component={Landing} />
          <PrivateRoute exact path="/Projects" component={Projects} />
          <PrivateRoute exact path="/:projectId/TestCase/:testcaseId" component={TestCase} />
          <PrivateRoute exact path="/:projectId/CreateTestCase" component={NewTestCase} />
          <PrivateRoute exact path="/:projectId/EditTestCase/:testcaseId" component={EditTestCase} />
          <PrivateRoute exact path="/:projectId/TestCases" component={TestCases} />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
