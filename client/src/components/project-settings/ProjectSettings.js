import React, { Component } from "react";
import GlobalPanel from "../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../components/project-panel/ProjectPanel";
import Header from "../../components/common/Header";

export default class Reports extends Component {
  render() {
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel props={this.props} />
        <div className="main-content main-content-grid">
          <Header icon={<i className="fas fa-cog"></i>} title={"Settings"} history={this.props} canGoBack={false} />
          <div className="list-item-container">
            <h1>Settings</h1>
          </div>
        </div>
      </div>
    );
  }
}
