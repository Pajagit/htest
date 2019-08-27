import React from "react";
import FormElementTitle from "../components/FormElementTitle";
import FullBtn from "../components/FullBtn";

function Input({ className, type, placeholder, label, validationMsg, addColumnPlaceholder }) {
  var addColumnElement = "";
  if (addColumnPlaceholder !== undefined) {
    addColumnElement = (
      <div>
        <FullBtn placeholder={addColumnPlaceholder} />
      </div>
    );
  }
  return (
    <div className="form-element">
      <div className="form-element-item">
        <FormElementTitle label={label} validationMsg={validationMsg} />
      </div>
      <div className="form-element-item">
        <input type={type} placeholder={placeholder} className="form-element--input" />
      </div>

      {addColumnElement}
      {/* <div className="form-element-item">
        <label className="form-element--validation">{validationMsg}</label>
      </div> */}
    </div>
  );
}

export default Input;
