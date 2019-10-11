import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { projectPanelSettingsPermission } from "../../permissions/GroupPermissions";
import { getProject } from "../../actions/projectActions";
import isEmpty from "../../validation/isEmpty";

import ProjectPanelItem from "./ProjectPanelItem";
import ProjectPanelDropdownItem from "./ProjectPanelDropdownItem";
import ProjectPanelHeader from "./ProjectPanelHeader";
import Loader from "../../img/loader.gif";

class ProjectPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      img: "",
      projectId: null,
      user: this.props.auth.user,
      testcasesUrl: false,
      reportsUrl: false,
      statisticsUrl: false,
      settingsUrl: false,
      settingsActive: false,
      settingsVisible: false,
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
      var { isValid } = projectPanelSettingsPermission(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );
      if (isValid) {
        update.settingsVisible = true;
      } else {
        update.settingsVisible = false;
      }
    }
    return Object.keys(update).length ? update : null;
  }

  componentDidMount() {
    var projectId = this.props.match.params.projectId;
    this.props.getProject(projectId);

    if (this.props.match.url === `/${projectId}/TestCases`) {
      this.setState({ testcasesUrl: true, reportsUrl: false, statisticsUrl: false, settingsUrl: false });
    } else if (this.props.match.url === `/${projectId}/Reports`) {
      this.setState({ testcasesUrl: false, reportsUrl: true, statisticsUrl: false, settingsUrl: false });
    } else if (this.props.match.url === `/${projectId}/Statistics`) {
      this.setState({ testcasesUrl: false, reportsUrl: false, statisticsUrl: true, settingsUrl: false });
    } else if (this.props.match.url === `/${projectId}/Settings`) {
      this.setState({ testcasesUrl: false, reportsUrl: false, statisticsUrl: false, settingsUrl: true });
    }
  }
  render() {
    var settings;
    var projectId = this.props.match.params.projectId;
    if (this.state.settingsVisible) {
      settings = (
        <ProjectPanelDropdownItem
          icon={<i className="fas fa-cog"></i>}
          title={"SETTINGS"}
          active={this.state.settingsUrl}
          settingsActive={this.state.settingsActive}
          onClick={e => this.setState({ settingsActive: !this.state.settingsActive })}
          options={[
            {
              title: "PROJECT INFO",
              link: `/${projectId}/ProjectInfo`,
              icon: <i className="fas fa-project-diagram"></i>
            },
            { title: "GROUPS", link: `/${projectId}/Groups`, icon: <i className="fas fa-object-group"></i> },
            { title: "DEVICES", link: `/${projectId}/Devices`, icon: <i className="fas fa-tablet-alt"></i> },
            { title: "BROWSERS", link: `/${projectId}/Browsers`, icon: <i className="far fa-window-maximize"></i> },
            { title: "VERSIONS", link: `/${projectId}/Versions`, icon: <i className="fas fa-code-branch"></i> },
            { title: "ENVIRONMENTS", link: `/${projectId}/Environments`, icon: <i className="fab fa-dev"></i> },
            { title: "TEST SETUP", link: `/${projectId}/TestSetup`, icon: <i className="fas fa-cogs"></i> }
          ]}
        />
      );
    }
    var img;
    var title;
    if (this.props.projects && this.props.projects.project) {
      img = this.props.projects.project.image_url;
      title = this.props.projects.project.title;
      if (isEmpty(this.props.projects.project.image_url)) {
        img = Loader;
      }
    }
    return (
      <div className="project-panel project-panel-grid">
        <div className="project-panel-items">
          <ProjectPanelHeader img={img} alt={title} title={title} />
          <ProjectPanelItem
            icon={<i className="fas fa-clipboard-list"></i>}
            title={"TEST CASES"}
            active={this.state.testcasesUrl}
            link={`/${projectId}/TestCases`}
          />
          <ProjectPanelItem
            icon={<i className="fas fa-file-alt"></i>}
            title={"REPORTS"}
            active={this.state.reportsUrl}
            link={`/${projectId}/Reports`}
          />
          <ProjectPanelItem
            icon={<i className="far fa-chart-bar"></i>}
            title={"STATISTIC"}
            active={this.state.statisticsUrl}
            link={`/${projectId}/Statistics`}
          />
          {settings}
        </div>
      </div>
    );
  }
}

ProjectPanel.propTypes = {
  testcases: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases,
  projects: state.projects,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getProject }
)(withRouter(ProjectPanel));
