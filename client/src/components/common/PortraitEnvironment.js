import React from "react";
import Checkbox from "./Checkbox";
import { Link } from "react-router-dom";

function PortraitEnvironment({ title, url, projectId, id }) {
  var link = "";
  link = (
    <Link to={`/${projectId}/EditBrowser/${id}`}>
      <i className="fas fa-pen"></i>
    </Link>
  );

  return (
    <div className="portrait-device">
      <div className="portrait-device-top">
        <div className="portrait-device-top-container">
          <div className="portrait-device-top-container--title">
            {title}
            <div className="portrait-device-top-container--title-btn">{link}</div>
          </div>
        </div>
      </div>

      <div className="portrait-device-bottom">
        <div className="portrait-device-bottom-container">
          <div className="portrait-device-bottom-container--item">
            <div className="portrait-device-bottom-container--item-title"> URL: </div>
            <div className="portrait-device-bottom-container--item-value">{url}</div>
          </div>
          <div className="portrait-device-bottom-container--item">
            <div className="portrait-device-bottom-container--item-title"></div>
            <div className="portrait-device-bottom-container--item-value"></div>
          </div>
          <div className="portrait-device-bottom-container--button">
            <Checkbox label={"Used on project"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortraitEnvironment;
