import React from "react";
import GlobalPanelItem from "./GlobalPanelItem";
import GlobalPanelHeader from "./GlobalPanelHeader";
import GlobalPanelProfileImage from "./GlobalPanelProfileImage";
import profileImage from "../../img/profile.jpg";

function GlobalPanel(props) {
  var projectsActive = false;
  var notificationsActive = false;
  var statisticsActive = false;
  var settingsActive = false;
  if (
    props.props.match.path === "/:projectId/CreateTestCase" ||
    props.props.match.path === "/:projectId/TestCases" ||
    props.props.match.path === "/Projects"
  ) {
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
        <GlobalPanelProfileImage img={profileImage} />
      </div>
    </div>
  );
}
export default GlobalPanel;
