import React from "react";
import { Link } from "react-router-dom";

function BtnAnchor({ className, label, link }) {
  return (
    <Link to={link}>
      <div className={className}>{label}</div>
    </Link>
  );
}

export default BtnAnchor;
