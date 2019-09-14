import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import "./sass/main.scss";

// import PrivateRoute from "./components/common/PrivateRoute";

import Test from "./pages/Test";
import NewTestCase from "./components/test-cases/NewTestCase";
import TestCases from "./components/test-cases/TestCases";
import Landing from "./pages/Landing";
import Projects from "./pages/Projects";
import TestCase from "./components/test-cases/TestCase";
import EditTestCase from "./components/test-cases/EditTestCase";

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
          <Route exact path="/Projects" component={Projects} />
          <Route exact path="/:projectId/TestCase/:testcaseId" component={TestCase} />
          <Route exact path="/:projectId/CreateTestCase" component={NewTestCase} />
          <Route exact path="/:projectId/EditTestCase/:testcaseId" component={EditTestCase} />
          <Route exact path="/:projectId/TestCases" component={TestCases} />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
