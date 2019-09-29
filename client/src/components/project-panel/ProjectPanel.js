import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ProjectPanelItem from "./ProjectPanelItem";
import ProjectPanelHeader from "./ProjectPanelHeader";
import humedsLogo from "../../img/humeds-logo.png";
import htecLogo from "../../img/htec-logo.png";

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
    if (this.props.match.params.projectId === "1") {
      this.setState({ title: "HUMEDS", img: humedsLogo, projectId: 1 });
    } else {
      this.setState({ title: "HTEC", img: htecLogo, projectId: 2 });
    }
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
    return (
      <div className="project-panel project-panel-grid">
        <div className="project-panel-items">
          <ProjectPanelHeader img={this.state.img} alt={this.state.title} title={this.state.title} />
          <ProjectPanelItem
            icon={<i className="fas fa-clipboard-list"></i>}
            title={"TEST CASES"}
            active={this.state.testcasesUrl}
            link={`/${this.state.projectId}/TestCases`}
          />
          <ProjectPanelItem
            icon={<i className="fas fa-file-alt"></i>}
            title={"REPORTS"}
            active={this.state.reportsUrl}
            link={`/${this.state.projectId}/Reports`}
          />
          <ProjectPanelItem
            icon={<i className="far fa-chart-bar"></i>}
            title={"STATISTIC"}
            active={this.state.statisticsUrl}
            link={`/${this.state.projectId}/Statistics`}
          />
          <ProjectPanelItem
            icon={<i className="fas fa-cog"></i>}
            title={"SETTINGS"}
            active={this.state.settingsUrl}
            link={`/${this.state.projectId}/Settings`}
          />
        </div>
      </div>
    );
  }
}

ProjectPanel.propTypes = {
  testcases: PropTypes.object.isRequired,
  groups: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases,
  groups: state.groups
  // auth: state.auth,
});

export default connect(
  mapStateToProps,
  {}
)(withRouter(ProjectPanel));
