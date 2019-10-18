import React from "react";
// import { Link } from "react-router-dom";

function GlobalPanelProfileImage({ img, onClick, linkStyle, onMouseEnter, onMouseLeave }) {
  var btnStyle = "";
  if (linkStyle) {
    btnStyle = "show-long-text";
  }

  return (
    <div className="global-panel-items--item-profile-image">
      <div className="right-corder-container" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <button className="right-corder-container-button">
          <span className="short-text">
            <img src={img} alt="Profile" className="global-panel-items--item-profile-image-options-parent"></img>
          </span>
          <span className={`long-text clickable ${btnStyle}`} onClick={onClick}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </span>
        </button>
      </div>
    </div>
  );
}
export default GlobalPanelProfileImage;
