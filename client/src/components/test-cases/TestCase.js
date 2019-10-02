import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

import GlobalPanel from "../global-panel/GlobalPanel";
import ProjectPanel from "../project-panel/ProjectPanel";
import UnderlineAnchor from "../common/UnderlineAnchor";
import BtnAnchor from "../common/BtnAnchor";
import Header from "../common/Header";
import Spinner from "../common/Spinner";
import openExternalBtn from "../../img/openExternalBtn.png";
import Tag from "../common/Tag";
import Btn from "../common/Btn";
import successToast from "../../toast/successToast";
import failToast from "../../toast/failToast";
import Confirm from "../common/Confirm";

import isEmpty from "../../validation/isEmpty";
import { getTestcase } from "../../actions/testcaseActions";
import { setTestcaseDeprecated } from "../../actions/testcaseActions";

class TestCase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testcaseId: null,
      projectId: null
    };
  }
  componentDidMount() {
    var testcaseId = this.props.match.params.testcaseId;
    var projectId = this.props.match.params.projectId;
    this.setState({ testcaseId, projectId });
    this.props.getTestcase(testcaseId);
  }

  confirmDeprecate = () => {
    this.props.setTestcaseDeprecated(this.state.testcaseId, res => {
      if (res.status === 200) {
        this.props.history.push(`/${this.state.projectId}/TestCases`);
        successToast("Test case set as deprecated successfully");
      } else {
        this.props.getTestcase(this.state.testcaseId);
        failToast(`Can not find Test Case with ${this.state.testcaseId} id`);
      }
    });
  };
  confirmModal = () => {
    Confirm(
      "Set this Test Case as deprecated?",
      "You will not be able to see or edit this Test Case anymore",
      "No",
      "Delete",
      this.confirmDeprecate
    );
  };

  render() {
    var { testcase } = this.props.testcases;
    var { loading } = this.props.testcases;
    var projectId = this.props.match.params.projectId;
    let content;

    if (testcase === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(testcase)) {
      content = (
        <div className="testcase-details">
          <div className="testcase-details--header">
            <div className="testcase-details-container-top">
              <div className="testcase-details-header">
                <div className="testcase-details-header--title">Test case name*</div>
                <div className="testcase-details-header--value">{testcase.title}</div>
              </div>
              <Link to={`/${projectId}/EditTestCase/${testcase.id}`}>
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
                      <Tag title={group.title} color={group.color} isRemovable={false} />
                    </span>
                  ))}
                  <br />
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
                  link={`/${projectId}/TestCases`}
                />
                <Btn
                  className="a-btn-outline a-btn-outline-primary mr-2"
                  label="Remove"
                  onClick={this.confirmModal}
                ></Btn>
                <UnderlineAnchor link={`/${projectId}/TestCases`} value={"Cancel"} />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      content = (
        <div className="testcase-details">
          <div className="testcase-details--header">
            <div className="testcase-details-container-top">
              <div className="testcase-details-header">
                <div className="testcase-details-header--title">Page not found</div>
                <div className="testcase-details-header--value">404</div>
              </div>
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
            canGoBack={true}
            link={`/${projectId}/TestCases`}
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
  { getTestcase, setTestcaseDeprecated }
)(withRouter(TestCase));
