import React from "react";
import FormElementTitle from "../form/FormElementTitle";

function Input({ className, type, placeholder, label, validationMsg, value, onChange, name }) {
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
          className="form-element--input"
          onChange={onChange}
          name={name}
        />
      </div>
    </div>
  );
}

export default Input;
