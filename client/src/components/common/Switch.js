import React from "react";
function Switch({ label, checked }) {
  var isChecked = "";
  if (checked) {
    isChecked = "checked";
  }
  return (
    <div className="switch-element">
      <label className="switch-element--label">{label}</label>
      <label className="switch">
        <input type="checkbox" checked={isChecked} />
        <span className="slider round"></span>
      </label>
    </div>
  );
}

export default Switch;
