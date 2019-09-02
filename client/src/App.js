import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./sass/main.scss";

import Test from "./pages/Test";
import NewTestCase from "./pages/NewTestCase";
import TestCases from "./pages/TestCases";
import Landing from "./pages/Landing";
import Projects from "./pages/Projects";

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/test" component={Test} />
        <Route exact path="/" component={Landing} />
        <Route exact path="/Projects" component={Projects} />
        <Route
          exact
          path="/:projectId/CreateTestCase"
          component={NewTestCase}
        />
        <Route exact path="/:projectId/TestCases" component={TestCases} />
      </div>
    </Router>
  );
}

export default App;
