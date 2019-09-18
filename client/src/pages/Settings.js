import React, { Component } from "react";
import GlobalPanel from "../components/global-panel/GlobalPanel";
import SettingPanel from "../components/settings-panel/SettingPanel";
import Header from "../components/common/Header";

class Settings extends Component {
  render() {
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <SettingPanel props={this.props} />
        <div className="main-content full-content-grid">
          <Header icon={<i className="fas fa-th"></i>} title={"Settings"} history={this.props} canGoBack={false} />
        </div>
      </div>
    );
  }
}
export default Settings;
