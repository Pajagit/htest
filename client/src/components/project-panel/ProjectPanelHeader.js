import React from "react";

function ProjectPanelHeader({ img, alt, title }) {
  return (
    <div className="project-panel-items-header">
      <div className="project-panel-items-header-img">
        <div className="project-panel--logo">
          <img src={img} alt={alt} />
        </div>
      </div>
      <div className="project-panel-items-header-title">{title}</div>
    </div>
  );
}
export default ProjectPanelHeader;
