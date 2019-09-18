import React from "react";
import settingImg from "../../img/settings.png";

function SettingPanelHeader({ img, alt, title }) {
  return (
    <div className="setting-panel-items-header">
      <div className="setting-panel-items-header-img">
        <div className="setting-panel--logo">
          <img src={settingImg} alt={alt} />
        </div>
      </div>
      <div className="setting-panel-items-header-title">{title}</div>
    </div>
  );
}
export default SettingPanelHeader;
