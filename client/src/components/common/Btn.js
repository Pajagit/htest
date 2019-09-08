import React from "react";
function Btn({ type, className, label, onClick }) {
  return (
    <button type={type} className={className} onClick={onClick}>
      {label}
    </button>
  );
}

export default Btn;
