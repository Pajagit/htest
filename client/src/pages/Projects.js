import React, { Component } from "react";
import GlobalPanel from "../components/global-panel/GlobalPanel";
import Header from "../components/common/Header";
import ProjectContainer from "../components/project/ProjectCardContainer";
import ProjectTableList from "../components/project/ProjectTableList";

class Projects extends Component {
  render() {
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <div className="main-content full-content-grid">
          <Header icon={<i className="fas fa-th"></i>} title={"Projects"} history={this.props} canGoBack={false} />

          <ProjectContainer />
          <ProjectTableList />
        </div>
      </div>
    );
  }
}
export default Projects;
