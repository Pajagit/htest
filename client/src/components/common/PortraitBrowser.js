import React from "react";
import Checkbox from "./Checkbox";
import Tag from "./Tag";
import { Link } from "react-router-dom";

function PortraitBrowser({ title, version, resolution, projectId, id }) {
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
            <div className="portrait-device-bottom-container--item-title"> Version: </div>
            <div className="portrait-device-bottom-container--item-value">{version}</div>
          </div>
          <div className="portrait-device-bottom-container--item">
            <div className="portrait-device-bottom-container--item-title">Resolution:</div>
            <div className="portrait-device-bottom-container--item-value">{resolution}</div>
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

export default PortraitBrowser;
