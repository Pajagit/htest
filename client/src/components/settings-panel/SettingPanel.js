import React, { Component } from "react";
import SettingPanelItem from "./SettingPanelItem";
import SettingPanelHeader from "./SettingPanelHeader";
class SettingPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      img: "",
      userSettingActive: false,
      projectSettingActive: false,
      deviceSettingActive: false,
      pathValue: {},
      errors: {}
    };
  }
  componentDidMount() {
    var pathName = this.props.props.history.location.pathname;
    if (
      pathName === "/UserSettings" ||
      pathName === `/EditUser/${this.props.props.match.params.userId}` ||
      pathName === "/AddUser"
    ) {
      this.setState({ userSettingActive: true, projectSettingActive: false, deviceSettingActive: false });
    } else if (
      pathName === "/ProjectSettings" ||
      pathName === `/EditProject/${this.props.props.match.params.projectId}` ||
      pathName === "/CreateProject"
    ) {
      this.setState({ userSettingActive: false, projectSettingActive: true, deviceSettingActive: false });
    } else if (pathName === "/DeviceSettings") {
      this.setState({ userSettingActive: false, projectSettingActive: false, deviceSettingActive: true });
    }
  }
  render() {
    return (
      <div className="setting-panel setting-panel-grid">
        <div className="setting-panel-items">
          <SettingPanelHeader img={this.state.img} alt={this.state.title} title={"SETTINGS"} />
          <SettingPanelItem
            icon={<i className="fas fa-user-cog"></i>}
            title={"USERS"}
            active={this.state.userSettingActive}
            link={`/UserSettings`}
          />
          <SettingPanelItem
            icon={<i className="fas fa-project-diagram"></i>}
            title={"PROJECTS"}
            active={this.state.projectSettingActive}
            link={`/ProjectSettings`}
          />
          <SettingPanelItem
            icon={<i className="fas fa-laptop"></i>}
            title={"DEVICES"}
            active={this.state.deviceSettingActive}
            link={`/DeviceSettings`}
          />
        </div>
      </div>
    );
  }
}

export default SettingPanel;
