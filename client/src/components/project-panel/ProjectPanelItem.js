import React from "react";
import { Link } from "react-router-dom";

function ProjectPanelItem({ icon, title, active, link }) {
  var activeBtnClass = "project-panel-items-btn";
  var activeTitleClass = "project-panel-items-btn-title";
  if (active) {
    activeBtnClass = "project-panel-items-btn project-panel-items-btn-active";
    activeTitleClass = "project-panel-items-btn-title project-panel-items-btn-title-active";
  }
  return (
    <div className="project-panel-items--item">
      <Link to={link}>
        <div className={activeBtnClass}>
          <div className="project-panel-items-btn-icon">{icon}</div>
          <div className={activeTitleClass}>{title}</div>
        </div>
      </Link>
    </div>
  );
}
export default ProjectPanelItem;
