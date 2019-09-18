import React from "react";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import jwt_decode from "jwt-decode";

import setAuthToken from "./actions/setAuthToken";

import { BrowserRouter as Router, Route } from "react-router-dom";
import PrivateRoute from "./components/common/PrivateRoute";

import { Provider } from "react-redux";

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
  // Set auth token header auth
  setAuthToken(localStorage.jwtHtestToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtHtestToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current profile
    // store.dispatch(clearCurrentProfile());
    // Redirect to login
    // window.location.href = "/";
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
