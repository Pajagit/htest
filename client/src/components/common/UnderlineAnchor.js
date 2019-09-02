import React from "react";

function UnderlineAnchor({ link, value }) {
  return (
    <div className="underline-anchor">
      <a href={link}>{value}</a>
    </div>
  );
}
export default UnderlineAnchor;
