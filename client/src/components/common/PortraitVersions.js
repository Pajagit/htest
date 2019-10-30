import React from "react";
import Checkbox from "./Checkbox";
import { Link } from "react-router-dom";

function PortraitEnvironment({ version, used, projectId, id, onClick }) {
  var link = "";
  link = (
    <Link to={`/${projectId}/EditVersion/${id}`}>
      <i className="fas fa-pen"></i>
    </Link>
  );
  return (
    <div className="portrait-device">
      <div className="portrait-device-top">
        <div className="portrait-device-top-container">
          <div className="portrait-device-top-container--title">
            {version}
            <div className="portrait-device-top-container--title-btn">{link}</div>
          </div>
        </div>
      </div>

      <div className="portrait-device-bottom">
        <div className="portrait-device-bottom-container">
          <div className="portrait-device-bottom-container--item">
            <div className="portrait-device-bottom-container--item-title"></div>
            <div className="portrait-device-bottom-container--item-value"></div>
          </div>
          <div className="portrait-device-bottom-container--item">
            <div className="portrait-device-bottom-container--item-title">
              <div className="portrait-device-bottom-container--button">
                <Checkbox label={"Used on project"} value={used} onClick={onClick} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortraitEnvironment;
