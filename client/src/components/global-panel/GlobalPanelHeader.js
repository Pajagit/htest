import React from "react";
import htecLogo from "../../img/htec-logo.png";

function GlobalPanelHeader() {
  return (
    <div className="global-panel-items--item">
      <div className="global-panel--logo">
        <img src={htecLogo} alt="HTEC" />
      </div>
    </div>
  );
}
export default GlobalPanelHeader;
