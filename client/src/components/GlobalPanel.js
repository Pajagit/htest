import React from "react";
import htecLogo from "../img/htec-logo.png";
function GlobalPanel() {
  return (
    <div className="global-panel global-panel-grid">
      <div className="global-panel-items">
        <div className="global-panel-items--item">
          <div className="global-panel--logo">
            <img src={htecLogo} alt="HTEC" />
          </div>
        </div>
        <div className="global-panel-items--item">
          <i className="fas fa-th"></i>
        </div>
        <div className="global-panel-items--item">
          <i className="fas fa-bell"></i>
        </div>
        <div className="global-panel-items--item">
          <i className="fas fa-chart-pie"></i>
        </div>
        <div className="global-panel-items--item">
          <i className="fas fa-user-cog"></i>
        </div>
      </div>
    </div>
  );
}
export default GlobalPanel;
