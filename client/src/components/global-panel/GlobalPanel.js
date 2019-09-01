import React from "react";
import GlobalPanelItem from "./GlobalPanelItem";
import GlobalPanelHeader from "./GlobalPanelHeader";

function GlobalPanel(props) {
  // console.log(props.props);
  var projectsActive = false;
  var notificationsActive = false;
  var statisticsActive = false;
  var settingsActive = false;
  if (props.props.match.path === "/:projectId/CreateTestCase" || props.props.match.path === "/:projectId/TestCases") {
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
        <GlobalPanelItem icon={<i className="fas fa-bell"></i>} link={"/Notifications"} active={notificationsActive} />
        <GlobalPanelItem icon={<i className="fas fa-chart-pie"></i>} link={"/Statistics"} active={statisticsActive} />
        <GlobalPanelItem icon={<i className="fas fa-user-cog"></i>} link={"/Settings"} active={settingsActive} />
      </div>
    </div>
  );
}
export default GlobalPanel;
