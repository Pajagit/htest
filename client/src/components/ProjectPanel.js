import React from "react";
import humedsLogo from "../img/humeds-logo.png";

function ProjectPanel() {
  return (
    <div className="project-panel project-panel-grid">
      <div className="project-panel-items">
        {/* <div className="project-panel-items--item"> */}

        <div className="project-panel-items-header">
          <div className="project-panel-items-header-img">
            <div className="project-panel--logo">
              <img src={humedsLogo} alt="Humeds" />
            </div>
          </div>
          <div className="project-panel-items-header-title">HUMEDS</div>
        </div>
        {/* </div> */}
        <div className="project-panel-items--item">
          <div className="project-panel-items-btn project-panel-items-btn-active">
            <div className="project-panel-items-btn-icon">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <div className="project-panel-items-btn-title project-panel-items-btn-title-active">TEST CASES</div>
          </div>
        </div>
        <div className="project-panel-items--item">
          <div className="project-panel-items-btn">
            <div className="project-panel-items-btn-icon">
              <i className="fas fa-file-alt"></i>
            </div>
            <div className="project-panel-items-btn-title">REPORTS</div>
          </div>
        </div>
        <div className="project-panel-items--item">
          <div className="project-panel-items-btn">
            <div className="project-panel-items-btn-icon">
              <i className="far fa-chart-bar"></i>
            </div>
            <div className="project-panel-items-btn-title">REPORTS</div>
          </div>
        </div>
        <div className="project-panel-items--item">
          <div className="project-panel-items-btn">
            <div className="project-panel-items-btn-icon">
              <i className="fas fa-cog"></i>
            </div>
            <div className="project-panel-items-btn-title">REPORTS</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProjectPanel;
