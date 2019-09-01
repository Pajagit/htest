import React from "react";
function Checkbox({ label }) {
  return (
    <div>
      <label className="container">
        <input type="checkbox" />
        <span className="checkmark"></span>
        <span className="container-label">{label}</span>
      </label>
    </div>
  );
}

export default Checkbox;
