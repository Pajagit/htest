import React from "react";
function FullBtn({ label, icon }) {
  return (
    <div className="full-width-btn">
      <div className="full-width-btn--label">{label}</div>
      <div className="full-width-btn--icon">
        <i className="fas fa-clone"></i>
      </div>
    </div>
  );
}

export default FullBtn;
