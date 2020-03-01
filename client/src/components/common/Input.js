import React from "react";
import FormElementTitle from "../form/FormElementTitle";

function Input({ className, type, placeholder, label, validationMsg, value, onChange, name, onKeyDown, id, noMargin }) {
  var classNameInput = "form-element--input";
  if (className) {
    classNameInput = `${classNameInput} disabled`;
  }
  var marginValue = "form-element";

  if (noMargin) {
    marginValue = "";
  }
  return (
    <div className={marginValue}>
      <div className='form-element-item'>
        <FormElementTitle label={label} validationMsg={validationMsg} />
      </div>
      <div className='form-element-item'>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          onKeyDown={onKeyDown}
          id={id}
          className={classNameInput}
        />
      </div>
    </div>
  );
}

export default Input;
