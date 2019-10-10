import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getProjects } from "../../actions/projectActions";
import { projectSettingsPermission } from "../../permissions/ProjectPermissions";
import isEmpty from "../../validation/isEmpty";
import projectImagePlaceholder from "../../img/project-placeholder.jpg";

import GlobalPanel from "../global-panel/GlobalPanel";
import SettingPanel from "../settings-panel/SettingPanel";
import BtnAnchor from "../common/BtnAnchor";
import Spinner from "../common/Spinner";
import ListItem from "../lists/ListItem";
import Header from "../common/Header";

class ProjectSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      projectId: null,
      user: this.props.auth.user,
      errors: {}
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    var { user } = nextProps.auth;
    if (nextProps.auth && nextProps.auth.user) {
      if (nextProps.auth.user !== prevState.user) {
        update.user = user;
      }
      var { isValid } = projectSettingsPermission(nextProps.auth.user.projects);

      if (!isValid) {
        nextProps.history.push(`/Projects`);
      }
    }
    return Object.keys(update).length ? update : null;
  }

  componentDidMount() {
    this.props.getProjects();
  }
  render() {
    var { projects, loading } = this.props.projects;
    var content;
    if (projects === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(projects)) {
      content = projects.map((project, index) => (
        <ListItem
          key={index}
          title={project.title}
          img={project.image_url ? project.image_url : projectImagePlaceholder}
          link={`/EditProject/${project.id}`}
          list={project.users.map((user, index) => (
            <React.Fragment key={index}>
              {user.first_name ? user.first_name + " " + user.last_name : user.email}
              {project.users.length - 1 > index ? `, ` : ``}
            </React.Fragment>
          ))}
        />
      ));
    } else {
      content = <div className="testcase-container-no-content">There are no projects created yet</div>;
    }

    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <SettingPanel props={this.props} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-project-diagram"></i>}
            title={"Project Settings"}
            history={this.props}
            canGoBack={false}
            addBtn={
              <BtnAnchor type={"text"} label="Add Project" className={"a-btn a-btn-primary"} link={`CreateProject`} />
            }
          />
          <div className="list-item-container">{content}</div>
        </div>
      </div>
    );
  }
}

ProjectSettings.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  projects: state.projects
});

export default connect(
  mapStateToProps,
  { getProjects }
)(withRouter(ProjectSettings));
