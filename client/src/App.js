import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./sass/main.scss";

import { Provider } from "react-redux";
import store from "./store";

// import PrivateRoute from "./components/common/PrivateRoute";

import Test from "./pages/Test";
import NewTestCase from "./pages/NewTestCase";
import TestCases from "./pages/TestCases";
import Landing from "./pages/Landing";
import Projects from "./pages/Projects";
import TestCase from "./pages/TestCase";
import EditTestCase from "./components/test-cases/EditTestCase";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Route exact path="/test" component={Test} />
          <Route exact path="/" component={Landing} />
          <Route exact path="/Projects" component={Projects} />
          <Route exact path="/TestCase/:testcaseId" component={TestCase} />
          <Route
            exact
            path="/:projectId/CreateTestCase"
            component={NewTestCase}
          />
          <Route exact path="/:projectId/TestCases" component={TestCases} />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
