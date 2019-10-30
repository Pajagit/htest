import React from "react";
import Checkbox from "./Checkbox";
import Tag from "./Tag";
import { Link } from "react-router-dom";

function PortraitDevice({ title, udid, resolution, office, dpi, id, simulator, retina, screen_size, projectId, os }) {
  var link = "";
  var udidValue = "";
  if (simulator) {
    link = (
      <Link to={`/${projectId}/EditSimulator/${id}`}>
        <i className="fas fa-pen"></i>
      </Link>
    );
  } else {
    udidValue = (
      <div className="portrait-device-bottom-container--item">
        <div className="portrait-device-bottom-container--item-title">UDID:</div>
        <div className="portrait-device-bottom-container--item-value"> {udid}</div>
      </div>
    );
  }

  var color = "";
  var officeValue = "";
  if (office) {
    if (office === "Nis") {
      color = "VERDIGRIS";
    } else if (office === "Belgrade") {
      color = "MEDIUM_SEA_GREEN";
    } else if (office === "Novi Sad") {
      color = "PALE_COPPER";
    } else if (office === "Banja Luka") {
      color = "FUZZY_WUZZY";
    }
    officeValue = (
      <div className="portrait-device-top-container--tags">
        <Tag title={office} color={color} isRemovable={false} />
      </div>
    );
  }
  return (
    <div className="portrait-device">
      <div className="portrait-device-top">
        <div className="portrait-device-top-container">
          <div className="portrait-device-top-container--title">
            {title}
            <div className="portrait-device-top-container--title-btn">{link}</div>
          </div>
          {officeValue}
        </div>
      </div>

      <div className="portrait-device-bottom">
        <div className="portrait-device-bottom-container">
          <div className="portrait-device-bottom-container--item">
            <div className="portrait-device-bottom-container--item-title"> Resolution: </div>
            <div className="portrait-device-bottom-container--item-value">{resolution}</div>
          </div>
          <div className="portrait-device-bottom-container--item">
            <div className="portrait-device-bottom-container--item-title">DPI:</div>
            <div className="portrait-device-bottom-container--item-value">{dpi}</div>
          </div>
          <div className="portrait-device-bottom-container--item">
            <div className="portrait-device-bottom-container--item-title">Size:</div>
            <div className="portrait-device-bottom-container--item-value">{screen_size}</div>
          </div>
          {udidValue}
          <div className="portrait-device-bottom-container--item">
            <div className="portrait-device-bottom-container--item-title">OS:</div>
            <div className="portrait-device-bottom-container--item-value">{os}</div>
          </div>
          <div className="portrait-device-bottom-container--item">
            <div className="portrait-device-bottom-container--item-title">Retina:</div>
            <div className="portrait-device-bottom-container--item-value">{retina ? "Yes" : "No"}</div>
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

export default PortraitDevice;
