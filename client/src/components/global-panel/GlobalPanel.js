import React, { Component } from "react";
import GlobalPanelItem from "./GlobalPanelItem";
import GlobalPanelHeader from "./GlobalPanelHeader";
import GlobalPanelProfileImage from "./GlobalPanelProfileImage";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import profileImage from "../../img/profile.jpg";

class GlobalPanel extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
  }
  render() {
    var projectsActive = false;
    var notificationsActive = false;
    var statisticsActive = false;
    var settingsActive = false;
    if (this.props.match.path.substring(0, 12) === "/:projectId/" || this.props.match.path === "/Projects") {
      projectsActive = true;
      notificationsActive = false;
      statisticsActive = false;
      settingsActive = false;
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
          <GlobalPanelItem icon={<i className="fas fa-user-cog"></i>} link={"/Settings"} active={settingsActive} />
          <GlobalPanelProfileImage img={profileImage} onClick={this.onLogoutClick.bind(this)} />
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
