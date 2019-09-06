import React from "react";
import FormElementTitle from "../form/FormElementTitle";

function Textarea({
  className,
  placeholder,
  label,
  validationMsg,
  value,
  onChange,
  name
}) {
  return (
    <div className="form-element">
      <div className="form-element-item">
        <FormElementTitle label={label} validationMsg={validationMsg} />
      </div>
      <div className="form-element-item">
        <textarea
          placeholder={placeholder}
          value={value}
          className="form-element--textarea"
          onChange={onChange}
          name={name}
        />
      </div>
      {/* <div className="form-element-item">
        <label className="form-element--validation">{validationMsg}</label>
      </div> */}
    </div>
  );
}

export default Textarea;