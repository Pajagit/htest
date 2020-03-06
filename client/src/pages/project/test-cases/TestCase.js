import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

import GlobalPanel from "../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../components/project-panel/ProjectPanel";
import BtnAnchor from "../../../components/common/BtnAnchor";
import Header from "../../../components/common/Header";
import Spinner from "../../../components/common/Spinner";
import openExternalBtn from "../../../img/openExternalBtn.png";
import Tag from "../../../components/common/Tag";

import { writePermissions, projectIdAndSuperAdminPermission } from "../../../permissions/Permissions";
import isEmpty from "../../../validation/isEmpty";
import { getTestcase } from "../../../actions/testcaseActions";

class TestCase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testcaseId: null,
      user: this.props.auth.user,
      isValid: false,
      isValidWrite: false,
      projectId: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    if (nextProps.auth && nextProps.auth.user) {
      var isValidWrite = writePermissions(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );

      var { isValid } = projectIdAndSuperAdminPermission(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );
      update.isValidWrite = isValidWrite.isValid;

      if (nextProps.auth.user !== prevState.user) {
        update.user = nextProps.auth.user;
        if (!isValid) {
          nextProps.history.push(`/${nextProps.match.params.projectId}/TestCases`);
        }
        update.isValid = isValid;
      }
    }

    return Object.keys(update).length ? update : null;
  }

  componentDidMount() {
    var testcaseId = this.props.match.params.testcaseId;
    var projectId = this.props.match.params.projectId;
    this.setState({ testcaseId, projectId });
    this.props.getTestcase(testcaseId);
  }

  render() {
    var { testcase } = this.props.testcases;
    var { loading } = this.props.testcases;
    var projectId = this.props.match.params.projectId;
    let content;
    var editBtn = "";
    if (this.state.isValidWrite) {
      editBtn = (
        <Link to={`/${projectId}/EditTestCase/${this.props.match.params.testcaseId}`}>
          <div className='testcase-details-button'>
            <div className='testcase-details-button-title'>Edit</div>
            <div className='testcase-details-button-icon'>
              <i className='fas fa-pen'></i>
            </div>
          </div>
        </Link>
      );
    }

    var precondition = "";
    var links = "";
    var uploaded_files = "";

    if (testcase === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(testcase)) {
      var actionBtns = "";
      if (this.state.isValidWrite) {
        actionBtns = (
          <div className='flex-column-left mt-4'>
            <BtnAnchor
              className='a-btn a-btn-primary mr-2'
              label='Add To Report'
              link={`/${projectId}/NewReport/${testcase.id}`}
            />
          </div>
        );
      }
      if (testcase.preconditions) {
        precondition = (
          <div className='testcase-details-item'>
            <div className='testcase-details-item--title'>Preconditions</div>
            <div className='testcase-details-item--value'>{testcase.preconditions}</div>
          </div>
        );
      }
      if (!isEmpty(testcase.links)) {
        links = (
          <div className='testcase-details-item'>
            <div className='testcase-details-item--title'>Links</div>
            {testcase.links.map((link, index) => (
              <span key={index}>
                <div className='testcase-details-item--value'>
                  <a href={link.value} target='_blank' rel='noopener noreferrer'>
                    <span className='mr-1'>{link.value}</span>{" "}
                    <img className='testcase-details-item--value-img' src={openExternalBtn} alt='External link' />
                  </a>
                </div>
              </span>
            ))}
          </div>
        );
      }
      if (!isEmpty(testcase.uploaded_files)) {
        uploaded_files = (
          <div className='testcase-details-item'>
            <div className='testcase-details-item--title'>Uploaded files</div>
            {testcase.uploaded_files.map((file, index) => (
              <span key={index}>
                <div className='testcase-details-item--value'>
                  <span className='mr-1'>{file.path}</span> <i className='fas fa-link'></i>
                </div>
              </span>
            ))}
          </div>
        );
      }

      content = (
        <div className='testcase-details'>
          <div className='testcase-details--header'>
            <div className='testcase-details-container-top'>
              <div className='testcase-details-header'>
                <div className='testcase-details-header--title'>Test Case Title</div>
                <div className='testcase-details-header--value'>{testcase.title}</div>
              </div>
              {editBtn}
            </div>
          </div>
          <div className='testcase-details--body'>
            <div className='testcase-details-container-bottom'>
              <div className='testcase-details-item'>
                <div className='testcase-details-item--title'>Description</div>
                <div className='testcase-details-item--value'>{testcase.description}</div>
              </div>
              <div className='testcase-details-item'>
                <div className='testcase-details-item--title'>Test Steps</div>

                {testcase.test_steps.map((test_step, index) => (
                  <div className='testcase-details-item--value' key={index}>
                    <span>
                      {`Step ${index + 1}. `}
                      {test_step.value}

                      <br />
                      <i>{!isEmpty(test_step.expected_result) ? `Expected: ${test_step.expected_result}` : ""}</i>
                    </span>
                  </div>
                ))}
              </div>
              <div className='testcase-details-item'>
                <div className='testcase-details-item--title'>Expected Result</div>
                <div className='testcase-details-item--value'>{testcase.expected_result}</div>
              </div>
              <div className='testcase-details-item'>
                <div className='testcase-details-item--title'>Groups</div>
                <div className='testcase-details-item--value'>
                  {testcase.groups.map((group, index) => (
                    <span key={index}>
                      <Tag title={group.title} color={group.color} isRemovable={false} />
                    </span>
                  ))}
                  <br />
                </div>
              </div>
              {precondition}
              {links}
              {uploaded_files}
              {actionBtns}
            </div>
          </div>
        </div>
      );
    } else {
      content = (
        <div className='testcase-details'>
          <div className='testcase-details--header'>
            <div className='testcase-details-container-top'>
              <div className='testcase-details-header'>
                <div className='testcase-details-header--title'>Page not found</div>
                <div className='testcase-details-header--value'>404</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className='wrapper'>
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className='main-content main-content-grid'>
          <Header
            icon={<i className='fas fa-arrow-left'></i>}
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
  testcases: state.testcases,
  auth: state.auth
});

export default connect(mapStateToProps, { getTestcase })(withRouter(TestCase));
