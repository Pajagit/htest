import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import Header from "../../../../components/common/Header";
import Spinner from "../../../../components/common/Spinner";

import { superAndProjectAdminPermissions } from "../../../../permissions/Permissions";
import isEmpty from "../../../../validation/isEmpty";
import { getProject } from "../../../../actions/projectActions";

class ProjectInfo extends Component {
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
      var { isValid } = superAndProjectAdminPermissions(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );

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
    var projectId = this.props.match.params.projectId;
    this.setState({ projectId });
    this.props.getProject(projectId);
  }

  render() {
    var { project } = this.props.projects;
    var { loading } = this.props.projects;
    var projectId = this.props.match.params.projectId;
    let content;

    if (project === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(project)) {
      content = (
        <div className="testcase-details">
          <div className="testcase-details--header">
            <div className="testcase-details-container-top">
              <div className="testcase-details-header">
                <div className="testcase-details-header--value">{<img src={project.image_url} alt="project" />}</div>
              </div>
              <Link to={`/${projectId}/ProjectSetting`}>
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
                <div className="testcase-details-item--title">Project</div>
                <div className="testcase-details-item--value">{project.title}</div>
              </div>
              <div className="testcase-details-item">
                <div className="testcase-details-item--title">Description</div>
                <div className="testcase-details-item--value">{project.description}</div>
              </div>
              <div className="testcase-details-item">
                <div className="testcase-details-item--title">Jira URL</div>
                <div className="testcase-details-item--value">{project.jira_url}</div>
              </div>
              <div className="testcase-details-item">
                <div className="testcase-details-item--title">URL</div>
                <div className="testcase-details-item--value">{project.url}</div>
              </div>
              <div className="testcase-details-item">
                <div className="testcase-details-item--title">Management</div>
                <div className="testcase-details-item--value">{project.project_manager}</div>
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
            icon={<i className="fas fa-project-diagram"></i>}
            title={"Project Information"}
            canGoBack={false}
            // link={`/${projectId}/TestCases`}
          />
          {content}
        </div>
      </div>
    );
  }
}

ProjectInfo.propTypes = {
  projects: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projects: state.projects,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getProject }
)(withRouter(ProjectInfo));
