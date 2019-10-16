import React from "react";
// import { Link } from "react-router-dom";

function GlobalPanelProfileImage({ img, onClick }) {
  return (
    <div className="global-panel-items--item-profile-image" onClick={onClick}>
      <nav className="global-panel-items--item-profile-image-options">
        <img src={img} alt="Profile"></img>
        <a href="#1">Item 1</a>
        <a href="#2">Item 2</a>
        <a href="#3">Item 3</a>
      </nav>
    </div>
  );
}
export default GlobalPanelProfileImage;
