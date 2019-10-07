import React from "react";
import { Link } from "react-router-dom";

function ProjectPanelDropdownItem({ icon, title, active, link, settingsActive, onClick, options }) {
  var activeBtnClass = "project-panel-items-btn";
  var activeTitleClass = "project-panel-items-btn-title";
  var activeDropdownTitleClass = "project-panel-items-btn-dropdown-title";
  if (active) {
    activeBtnClass = "project-panel-items-btn project-panel-items-btn-active";
    activeTitleClass = "project-panel-items-btn-title project-panel-items-btn-title-active";
  }
  var linkOptions = "";
  var dropdownArrow = <i className="fas fa-caret-down"></i>;
  if (settingsActive) {
    linkOptions = options.map((option, index) => (
      <div className={activeBtnClass} key={index}>
        <div className="project-panel-items-btn-dropdown-icon">
          <i className="fas fa-arrow-right"></i>
        </div>
        <Link to={option.link}>
          <div className={activeDropdownTitleClass}>{option.title}</div>
        </Link>
      </div>
    ));

    dropdownArrow = <i className="fas fa-caret-up"></i>;
  }
  return (
    <div className="project-panel-items--item noselect" onClick={onClick}>
      <div className={activeBtnClass}>
        <div className="project-panel-items-btn-icon">{icon}</div>
        <div className={activeTitleClass}>{title}</div>
        <div className="project-panel-items-btn-dropdown-icon float-right">{dropdownArrow}</div>
      </div>
      <div> {linkOptions}</div>
    </div>
  );
}
export default ProjectPanelDropdownItem;
