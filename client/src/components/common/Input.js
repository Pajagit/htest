import React from "react";
import FormElementTitle from "../form/FormElementTitle";

function Input({ className, type, placeholder, label, validationMsg, value, onChange, name, onKeyDown }) {
  var classNameInput = "form-element--input";
  if (className) {
    classNameInput = `${classNameInput} disabled`;
  }
  return (
    <div className="form-element">
      <div className="form-element-item">
        <FormElementTitle label={label} validationMsg={validationMsg} />
      </div>
      <div className="form-element-item">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          onKeyDown={onKeyDown}
          className={classNameInput}
        />
      </div>
    </div>
  );
}

export default Input;
