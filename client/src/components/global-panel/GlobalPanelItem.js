import React from "react";

function GlobalPanelItem({ icon, active, link }) {
  var activeBtnClass = "global-panel-items--item";
  if (active) {
    activeBtnClass = "global-panel-items--item global-panel-items--item-active";
  }
  return (
    <div className={activeBtnClass}>
      <a href={link}>{icon} </a>
    </div>
  );
}
export default GlobalPanelItem;
