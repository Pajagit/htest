import React from "react";
import { Link } from "react-router-dom";

function GlobalPanelItem({ icon, active, link, notification }) {
  var notificationCount = "";
  if (notification !== undefined) {
    notificationCount = <div className="global-panel-items--item-notification">{notification}</div>;
  }
  var activeBtnClass = "global-panel-items--item";
  if (active) {
    activeBtnClass = "global-panel-items--item global-panel-items--item-active";
  }
  return (
    <Link to={link}>
      <div className={activeBtnClass}>
        {icon}
        {notificationCount}
      </div>
    </Link>
  );
}
export default GlobalPanelItem;
