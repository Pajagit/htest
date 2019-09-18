import React from "react";
import { Link } from "react-router-dom";

function SettingPanelItem({ icon, title, active, link }) {
  var activeBtnClass = "setting-panel-items-btn";
  var activeTitleClass = "setting-panel-items-btn-title";
  if (active) {
    activeBtnClass = "setting-panel-items-btn setting-panel-items-btn-active";
    activeTitleClass = "setting-panel-items-btn-title setting-panel-items-btn-title-active";
  }
  return (
    <div className="setting-panel-items--item">
      <Link to={link}>
        <div className={activeBtnClass}>
          <div className="setting-panel-items-btn-icon">{icon}</div>
          <div className={activeTitleClass}>{title}</div>
        </div>
      </Link>
    </div>
  );
}
export default SettingPanelItem;
