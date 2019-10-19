import React from "react";
import { Link } from "react-router-dom";

function BtnAnchorResponsive({ className, label, link }) {
  return (
    <Link to={link}>
      <div className={className}>
        <div className="a-btn-responsive-icon">
          <i className="fas fa-plus"></i>
        </div>
        <div className="a-btn-responsive-label">{label}</div>
      </div>
    </Link>
  );
}

export default BtnAnchorResponsive;
