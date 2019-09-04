import React from "react";
import { Link } from "react-router-dom";

function UnderlineAnchor({ link, value }) {
  return (
    <div className="underline-anchor">
      <Link to={link}>{value}</Link>
    </div>
  );
}
export default UnderlineAnchor;
