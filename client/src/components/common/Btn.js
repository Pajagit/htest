import React from "react";
function Btn({ type, className, label, onClick, disabled }) {
  var classNameValue = className;
  if (disabled) {
    classNameValue = className + " disabled";
  }
  return (
    <button type={type} className={classNameValue} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

export default Btn;
