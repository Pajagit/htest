import React from "react";
function Switch({ label, checked, onChange, name, value }) {
  var isChecked = "";
  if (value) {
    isChecked = "checked";
  }
  return (
    <div className="switch-element">
      <label className="switch-element--label">{label}</label>
      <label className="switch">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
          name={name}
          value={value}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
}

export default Switch;
