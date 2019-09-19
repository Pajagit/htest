import React, { Component } from "react";
import GlobalPanel from "../components/global-panel/GlobalPanel";
import SettingPanel from "../components/settings-panel/SettingPanel";
import BtnAnchor from "../components/common/BtnAnchor";
import ListItem from "../components/lists/ListItem";
import Header from "../components/common/Header";
import stenaImg from "../img/stena-bulk.jpg";
import img from "../img/quinyx.jpg";

class UserSettings extends Component {
  render() {
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <SettingPanel props={this.props} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-user-cog"></i>}
            title={"User Settings"}
            history={this.props}
            canGoBack={false}
            addBtn={<BtnAnchor type={"text"} label="Add User" className={"a-btn a-btn-primary"} link={`AddUser`} />}
          />
          <div className="list-item-container">
            <ListItem title={"Aleksandar Pavlovic"} list={"Stena Orbit, Quinyx"} img={stenaImg} />
            <ListItem title={"Milos Najdanovic"} list={"Quinyx"} img={img} />
          </div>
        </div>
      </div>
    );
  }
}
export default UserSettings;
