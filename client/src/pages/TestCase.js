import React, { Component } from "react";
import GlobalPanel from "../components/global-panel/GlobalPanel";
import ProjectPanel from "../components/project-panel/ProjectPanel";
import UnderlineAnchor from "../components/common/UnderlineAnchor";
import BtnAnchor from "../components/common/BtnAnchor";
import Checkbox from "../components/common/Checkbox";

import Header from "../components/common/Header";

class TestCase extends Component {
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
              <div className="testcase-details-container-top">
                <div className="testcase-details-header">
                  <div className="testcase-details-header--title">
                    Test case name*
                  </div>
                  <div className="testcase-details-header--value">
                    Check all the optional fields when do not fill data
                  </div>
                </div>
                <div className="testcase-details-button">
                  <div className="testcase-details-button-title">Edit</div>
                  <div className="testcase-details-button-icon">
                    <i className="fas fa-pen"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="testcase-details--body">
              <div className="testcase-details-container-bottom">
                <div className="testcase-details-item">
                  <div className="testcase-details-item--title">
                    Description*
                  </div>
                  <div className="testcase-details-item--value">
                    It taught me how to let go of any creative ego, which has
                    little space to breath when your work is put through its
                    paces in real world scenarios — it keeps everyone honest and
                    ensures our ideas are being validated throughout the
                    process.
                  </div>
                </div>
                <div className="testcase-details-item">
                  <div className="testcase-details-item--title">
                    Test Steps*
                  </div>
                  <div className="testcase-details-item--value">
                    Enter valid data in required fields
                  </div>
                </div>
                <div className="testcase-details-item">
                  <div className="testcase-details-item--title">
                    Expected Result*
                  </div>
                  <div className="testcase-details-item--value">
                    Successfully logged in
                  </div>
                </div>
                <div className="testcase-details-item">
                  <div className="testcase-details-item--title">Groups*</div>
                  <div className="testcase-details-item--value">
                    Health Check, Automated, UI
                  </div>
                </div>
                <div className="testcase-details-item">
                  <div className="testcase-details-item--title">
                    Preconditions
                  </div>
                  <div className="testcase-details-item--value">
                    User has internet connection
                  </div>
                </div>
                <div className="testcase-details-item">
                  <div className="testcase-details-item--title">Links</div>
                  <div className="testcase-details-item--value">
                    http://www.google.com
                  </div>
                </div>
                <div className="testcase-details-item">
                  <div className="testcase-details-item--title">
                    Uploaded files
                  </div>
                  <div className="testcase-details-item--value">
                    Htest_wireframe_IS_v2.0.pdf
                  </div>
                </div>
                <div className="flex-column-left mt-4">
                  <BtnAnchor
                    className="a-btn a-btn-primary mr-2"
                    label="Add To Report"
                    link={"/1/TestCases"}
                  />
                  <UnderlineAnchor link={"/1/TestCases"} value={"Cancel"} />
                </div>
                <Checkbox label="Set old test case as deprecated" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default TestCase;
