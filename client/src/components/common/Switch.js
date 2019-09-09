import React from "react";
function Switch({ label, onClick, name, value, id }) {
  var isChecked = false;
  if (value) {
    isChecked = true;
  }
  return (
    <div className="switch-element">
      <label className="switch-element--label">{label}</label>
      <label className="switch">
        <input type="checkbox" defaultChecked={isChecked} onClick={onClick} name={name} id={id} />
        <span className="slider round"></span>
      </label>
    </div>
  );
}

export default Switch;
