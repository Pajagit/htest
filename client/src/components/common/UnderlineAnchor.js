import React from "react";
import { Link } from "react-router-dom";

function UnderlineAnchor({ link, value, name }) {
  return (
    <div className="underline-anchor">
      <Link to={link} name={name}>
        {value}
      </Link>
    </div>
  );
}
export default UnderlineAnchor;
