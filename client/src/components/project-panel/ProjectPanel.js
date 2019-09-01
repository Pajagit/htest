import React, { Component } from "react";
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
      errors: {}
    };
  }
  componentDidMount() {
    if (this.props.projectId === "1") {
      this.setState({ title: "HUMEDS", img: humedsLogo, projectId: 1 });
    } else {
      this.setState({ title: "HTEC", img: htecLogo, projectId: 2 });
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
            active={true}
            link={`/${this.state.projectId}/TestCases`}
          />
          <ProjectPanelItem
            icon={<i className="fas fa-file-alt"></i>}
            title={"REPORTS"}
            active={false}
            link={`/${this.state.projectId}/Reports`}
          />
          <ProjectPanelItem
            icon={<i className="far fa-chart-bar"></i>}
            title={"STATISTICS"}
            active={false}
            link={`/${this.state.projectId}/Statistics`}
          />
          <ProjectPanelItem
            icon={<i className="fas fa-cog"></i>}
            title={"SETTINGS"}
            active={false}
            link={`/${this.state.projectId}/Settings`}
          />
        </div>
      </div>
    );
  }
}

export default ProjectPanel;
