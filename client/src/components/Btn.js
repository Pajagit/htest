import React from "react";
function Btn({ type, className, label }) {
  return (
    <div>
      <button type={type} className={className}>
        {label}
      </button>
    </div>
  );
}

export default Btn;
