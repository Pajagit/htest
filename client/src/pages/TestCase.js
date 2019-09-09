import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

import GlobalPanel from "../components/global-panel/GlobalPanel";
import ProjectPanel from "../components/project-panel/ProjectPanel";
import UnderlineAnchor from "../components/common/UnderlineAnchor";
import BtnAnchor from "../components/common/BtnAnchor";
import Checkbox from "../components/common/Checkbox";
import Header from "../components/common/Header";
import Spinner from "../components/common/Spinner";
import openExternalBtn from "../img/openExternalBtn.png";

import { getTestcase } from "../actions/testcaseActions";

class TestCase extends Component {
  componentDidMount() {
    var testcaseId = this.props.match.params.testcaseId;
    this.props.getTestcase(testcaseId);
  }
  render() {
    var { testcase } = this.props.testcases;
    var { loading } = this.props.testcases;
    let content;
    if (testcase === null || loading) {
      content = <Spinner />;
    } else {
      content = (
        <div className="testcase-details">
          <div className="testcase-details--header">
            <div className="testcase-details-container-top">
              <div className="testcase-details-header">
                <div className="testcase-details-header--title">Test case name*</div>
                <div className="testcase-details-header--value">{testcase.title}</div>
              </div>
              <Link to={`/EditTestCase/${testcase.id}`}>
                <div className="testcase-details-button">
                  <div className="testcase-details-button-title">Edit</div>
                  <div className="testcase-details-button-icon">
                    <i className="fas fa-pen"></i>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="testcase-details--body">
            <div className="testcase-details-container-bottom">
              <div className="testcase-details-item">
                <div className="testcase-details-item--title">Description*</div>
                <div className="testcase-details-item--value">{testcase.description}</div>
              </div>
              <div className="testcase-details-item">
                <div className="testcase-details-item--title">Test Steps*</div>

                {testcase.test_steps.map((test_step, index) => (
                  <div className="testcase-details-item--value" key={index}>
                    <span>
                      {`${index + 1}. `}
                      {test_step.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="testcase-details-item">
                <div className="testcase-details-item--title">Expected Result*</div>
                <div className="testcase-details-item--value">{testcase.expected_result}</div>
              </div>
              <div className="testcase-details-item">
                <div className="testcase-details-item--title">Groups*</div>
                <div className="testcase-details-item--value">
                  {testcase.groups.map((group, index) => (
                    <span key={index}>
                      {group.value}
                      {testcase.groups.length - 1 > index ? `, ` : ``}
                    </span>
                  ))}
                </div>
              </div>
              <div className="testcase-details-item">
                <div className="testcase-details-item--title">Preconditions</div>
                <div className="testcase-details-item--value">{testcase.preconditions}</div>
              </div>
              <div className="testcase-details-item">
                <div className="testcase-details-item--title">Links</div>
                {testcase.links.map((link, index) => (
                  <span key={index}>
                    <div className="testcase-details-item--value">
                      <a href={link.value} target="_blank" rel="noopener noreferrer">
                        <span className="mr-1">{link.value}</span>{" "}
                        <img className="testcase-details-item--value-img" src={openExternalBtn} alt="External link" />
                      </a>
                    </div>
                  </span>
                ))}
              </div>
              <div className="testcase-details-item">
                <div className="testcase-details-item--title">Uploaded files</div>
                {testcase.uploaded_files.map((file, index) => (
                  <span key={index}>
                    <div className="testcase-details-item--value">
                      <span className="mr-1">{file.path}</span> <i className="fas fa-link"></i>
                    </div>
                  </span>
                ))}
              </div>
              <div className="flex-column-left mt-4">
                <BtnAnchor
                  className="a-btn a-btn-primary mr-2"
                  label="Add To Report"
                  link={`/${testcase.id}/TestCases`}
                />
                <UnderlineAnchor link={`/${testcase.id}/TestCases`} value={"Cancel"} />
              </div>
              <Checkbox label="Set old test case as deprecated" />
            </div>
          </div>
        </div>
      );
    }
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
          {content}
        </div>
      </div>
    );
  }
}

TestCase.propTypes = {
  testcases: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases
  // auth: state.auth,
});

export default connect(
  mapStateToProps,
  { getTestcase }
)(withRouter(TestCase));
