import React from "react";

function FormElementTitle({ label, validationMsg }) {
  var validationMessage = "";
  if (validationMsg !== undefined) {
    validationMessage = (
      <span className="float-right">
        <label className="form-element--validation">{validationMsg}</label>
      </span>
    );
  }
  return (
    <div>
      <label className="form-element--label">
        {label}
        {validationMessage}
      </label>
    </div>
  );
}

export default FormElementTitle;
