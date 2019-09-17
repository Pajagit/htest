import React from "react";
// import { Link } from "react-router-dom";

function GlobalPanelProfileImage({ img, onClick }) {
  return (
    <div className="global-panel-items--item-profile-image" onClick={onClick}>
      <img src={img} alt="Profile"></img>
    </div>
  );
}
export default GlobalPanelProfileImage;
