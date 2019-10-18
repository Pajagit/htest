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
      <Link to={option.link} key={index}>
        <div className={`${activeBtnClass}`}>
          <div className="project-panel-items-btn-icon">{option.icon}</div>

          <div className={activeDropdownTitleClass}>{option.title}</div>
        </div>
      </Link>
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
      <div className="project-panel-dropdown"> {linkOptions}</div>
    </div>
  );
}
export default ProjectPanelDropdownItem;
