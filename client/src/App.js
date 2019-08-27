import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./sass/main.scss";

import Test from "./pages/Test";
import NewTestCase from "./pages/NewTestCase";

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/test" component={Test} />
        <Route exact path="/CreateTestCase" component={NewTestCase} />
      </div>
    </Router>
  );
}

export default App;
