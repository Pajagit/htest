import React from "react";
function Checkbox({ label, name, onClick, value }) {
  var isChecked = false;
  if (value) {
    isChecked = true;
  }
  return (
    <div>
      <label className="container">
        <input type="checkbox" onClick={onClick} name={name} defaultChecked={isChecked} value={value} />
        <span className="checkmark"></span>
        <span className="container-label">{label}</span>
      </label>
    </div>
  );
}

export default Checkbox;
