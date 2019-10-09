import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { logoutUser } from "../../actions/authActions";
import { globalSettingsPermission } from "../../permissions/GlobalSettingsPermissions";

import GlobalPanelItem from "./GlobalPanelItem";
import GlobalPanelHeader from "./GlobalPanelHeader";
import GlobalPanelProfileImage from "./GlobalPanelProfileImage";

class GlobalPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: null,
      user: this.props.auth.user,
      settingsVisible: false,
      errors: {}
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    var { user } = nextProps.auth;
    if (nextProps.auth && nextProps.auth.user) {
      if (nextProps.auth.user !== prevState.user) {
        update.user = user;
      }
      var { isValid } = globalSettingsPermission(nextProps.auth.user.projects, nextProps.match.params.projectId);

      if (isValid) {
        update.settingsVisible = true;
      } else {
        update.settingsVisible = false;
      }
    }
    return Object.keys(update).length ? update : null;
  }

  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
  }
  render() {
    var userImg = this.props.auth.user.image_url;
    var projectsActive = false;
    var notificationsActive = false;
    var statisticsActive = false;
    var settingsActive = false;
    if (this.props.match.path.substring(0, 12) === "/:projectId/" || this.props.match.path === "/Projects") {
      projectsActive = true;
      notificationsActive = false;
      statisticsActive = false;
      settingsActive = false;
    } else if (
      this.props.match.path === "/UserSettings" ||
      this.props.match.path === "/ProjectSettings" ||
      this.props.match.path === "/DeviceSettings" ||
      this.props.match.path === "/EditUser/:userId"
    ) {
      projectsActive = false;
      notificationsActive = false;
      statisticsActive = false;
      settingsActive = true;
    } else if (this.props.match.path === "/Notifications") {
      projectsActive = false;
      notificationsActive = true;
      statisticsActive = false;
      settingsActive = false;
    } else if (this.props.match.path === "/Statistics") {
      projectsActive = false;
      notificationsActive = false;
      statisticsActive = true;
      settingsActive = false;
    }

    var settings;
    if (this.state.settingsVisible) {
      settings = (
        <GlobalPanelItem icon={<i className="fas fa-user-cog"></i>} link={"/UserSettings"} active={settingsActive} />
      );
    }

    return (
      <div className="global-panel global-panel-grid">
        <div className="global-panel-items">
          <GlobalPanelHeader />
          <GlobalPanelItem icon={<i className="fas fa-th"></i>} link={"/Projects"} active={projectsActive} />
          <GlobalPanelItem
            icon={<i className="fas fa-bell"></i>}
            link={"/Notifications"}
            active={notificationsActive}
            notification={14}
          />
          <GlobalPanelItem icon={<i className="fas fa-chart-pie"></i>} link={"/Statistics"} active={statisticsActive} />
          {settings}
          <GlobalPanelProfileImage img={userImg} onClick={this.onLogoutClick.bind(this)} />
        </div>
      </div>
    );
  }
}

GlobalPanel.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  // testcases: state.testcases
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(GlobalPanel));
