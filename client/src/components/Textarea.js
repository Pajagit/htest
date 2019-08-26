import React from "react";
function Textarea({ className, placeholder, label, validationMsg }) {
  return (
    <div className="form-element">
      <label className="form-element--label">{label}</label>
      <textarea placeholder={placeholder} className="form-element--textarea" />
      <label className="form-element--validation">{validationMsg}</label>
    </div>
  );
}

export default Textarea;
