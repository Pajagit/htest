import React, { Component } from "react";
import SettingPanelItem from "./SettingPanelItem";
import SettingPanelHeader from "./SettingPanelHeader";
class SettingPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      img: "",
      projectId: null,
      errors: {}
    };
  }

  render() {
    return (
      <div className="setting-panel setting-panel-grid">
        <div className="setting-panel-items">
          <SettingPanelHeader img={this.state.img} alt={this.state.title} title={"SETTINGS"} />
          <SettingPanelItem
            icon={<i className="fas fa-user-cog"></i>}
            title={"USERS"}
            active={true}
            link={`/${this.state.projectId}/TestCases`}
          />
          <SettingPanelItem
            icon={<i className="fas fa-project-diagram"></i>}
            title={"PROJECTS"}
            active={false}
            link={`/${this.state.projectId}/Reports`}
          />
          <SettingPanelItem
            icon={<i className="fas fa-mobile-alt"></i>}
            title={"DEVICES"}
            active={false}
            link={`/${this.state.projectId}/Statistic`}
          />
        </div>
      </div>
    );
  }
}

export default SettingPanel;
