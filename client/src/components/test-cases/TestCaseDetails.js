import React, { Component } from "react";
import GlobalPanel from "../global-panel/GlobalPanel";
import ProjectPanel from "../project-panel/ProjectPanel";
import Header from "../common/Header";

class TestCaseDetails extends Component {
  render() {
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-arrow-left"></i>}
            title={"Back to All Test Cases"}
            history={this.props}
            canGoBack={true}
          />
          <div className="testcase-details">
            <div className="testcase-details--header">
              <div className="testcase-details-container">
                <div className="testcase-details-item">
                  <div className="testcase-details-item--title">
                    Test case name*
                  </div>
                  <div className="testcase-details-item--value">
                    Check all the optional fields when do not fill data
                  </div>
                </div>
                <div className="testcase-details-button">Edit</div>
              </div>
            </div>
            <div className="testcase-details--body">
              <div className="testcase-details-container"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TestCaseDetails;
