import React from "react";
function Btn({ type, className, label }) {
  return (
    <button type={type} className={className}>
      {label}
    </button>
  );
}

export default Btn;
