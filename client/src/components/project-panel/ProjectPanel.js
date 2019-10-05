import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getProject } from "../../actions/projectActions";
import isEmpty from "../../validation/isEmpty";

import ProjectPanelItem from "./ProjectPanelItem";
import ProjectPanelHeader from "./ProjectPanelHeader";
import Loader from "../../img/loader.gif";

class ProjectPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      img: "",
      projectId: null,
      testcasesUrl: false,
      reportsUrl: false,
      statisticsUrl: false,
      settingsUrl: false,
      errors: {}
    };
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
    var img;
    var projectId = this.props.match.params.projectId;
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
          <ProjectPanelItem
            icon={<i className="fas fa-cog"></i>}
            title={"SETTINGS"}
            active={this.state.settingsUrl}
            link={`/${projectId}/Settings`}
          />
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
  projects: state.projects
  // auth: state.auth,
});

export default connect(
  mapStateToProps,
  { getProject }
)(withRouter(ProjectPanel));
