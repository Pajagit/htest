import React from "react";
import Checkbox from "./Checkbox";
import { Link } from "react-router-dom";

function PortraitDevice({ title, udid, resolution, office, dpi, id, simulator, retina, screen_size, projectId }) {
  var link = "";
  if (simulator) {
    link = (
      <Link to={`/${projectId}/EditSimulator/${id}`}>
        <i className="fas fa-pen"></i>
      </Link>
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
          <div className="portrait-device-top-container--author">{office}</div>
        </div>
      </div>

      <div className="portrait-device-bottom">
        <div className="portrait-device-bottom-container">
          <div className="portrait-device-bottom-container--item">Resolution: {resolution}</div>
          <div className="portrait-device-bottom-container--item">DPI: {dpi}</div>
          <div className="portrait-device-bottom-container--item">UDID: {udid}</div>
          <div className="portrait-device-bottom-container--item">Size: {screen_size}</div>
          <div className="portrait-device-bottom-container--item">OS: 10.1</div>
          <div className="portrait-device-bottom-container--item">Retina: {retina ? "Yes" : "No"}</div>
          <div className="portrait-device-bottom-container--button">
            <Checkbox label={"Used on project"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortraitDevice;
