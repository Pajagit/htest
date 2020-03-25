import React from "react";
import ReactTooltip from "react-tooltip";

function Btn({ type, className, label, onClick, disabled, tooltip, tooltipId }) {
  var classNameValue = className;
  if (disabled) {
    classNameValue = className + " disabled";
  }

  var tooltipValue = "";
  var tooltipIdValue = "";
  if (tooltip) {
    tooltipValue = (
      <ReactTooltip
        id={tooltipId}
        aria-haspopup='true'
        className='custom-color-no-arrow'
        textColor='#000'
        backgroundColor='#eee'
        effect='solid'
      >
        <p>{tooltip}</p>
      </ReactTooltip>
    );
    tooltipIdValue = tooltipId;
  }

  return (
    <button
      type={type}
      className={classNameValue}
      onClick={onClick}
      disabled={disabled}
      data-tip
      data-for={tooltipIdValue}
    >
      {label}
      {tooltipValue}
    </button>
  );
}

export default Btn;
