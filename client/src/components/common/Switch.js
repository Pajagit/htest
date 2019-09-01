import React from "react";
function Switch({ label }) {
  return (
    <div className="switch-element">
      <label className="switch-element--label">{label}</label>
      <label className="switch">
        <input type="checkbox" />
        <span className="slider round"></span>
      </label>
    </div>
  );
}

export default Switch;
