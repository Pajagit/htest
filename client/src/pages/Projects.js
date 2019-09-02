import React, { Component } from "react";
import GlobalPanel from "../components/global-panel/GlobalPanel";
import Header from "../components/common/Header";
import ProjectContainer from "../components/project/ProjectContainer";
import ProjectList from "../components/project/ProjectList";

class Projects extends Component {
  render() {
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <div className="main-content full-content-grid">
          <Header
            icon={<i className="fas fa-th"></i>}
            title={"Projects"}
            history={this.props}
            canGoBack={false}
          />
          <div className=" project-container">
            <div className="project-container-title">Recently Viewed</div>
          </div>
          <ProjectContainer />
          <ProjectList />
        </div>
      </div>
    );
  }
}
export default Projects;
