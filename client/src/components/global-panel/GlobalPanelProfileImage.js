import React from "react";
import { Link } from "react-router-dom";

function GlobalPanelProfileImage({ img }) {
  return (
    <Link to="/">
      <div className="global-panel-items--item-profile-image">
        <img src={img} alt="Profile"></img>
      </div>
    </Link>
  );
}
export default GlobalPanelProfileImage;
