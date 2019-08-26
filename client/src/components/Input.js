import React from "react";
function Input({ className, type, placeholder, label, validationMsg }) {
  return (
    <div className="form-element">
      <label className="form-element--label">{label}</label>
      <input type={type} placeholder={placeholder} className="form-element--input" />
      <label className="form-element--validation">{validationMsg}</label>
    </div>
  );
}

export default Input;
