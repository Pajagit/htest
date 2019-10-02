import React from "react";
import isEmpty from "../../validation/isEmpty";
import FormElementTitle from "../form/FormElementTitle";
import removeBtn from "../../img/removeBtn.png";

function DropdownRemove({ options, placeholder, value, label, validationMsg, onChange, name, role, onClickRemove }) {
  var placeholderValue = "";
  if (isEmpty(value)) {
    placeholderValue = (
      <option value="0" className="default">
        {placeholder}
      </option>
    );
  }
  return (
    <div className="form-element">
      <div className="form-element-item">
        <FormElementTitle label={label} validationMsg={validationMsg} />
      </div>
      <div className="form-element-item">
        <select className="form-element--dropdown-with-remove" onChange={onChange} name={name} value={role}>
          {placeholderValue}

          {options.map((option, index) => (
            <option key={index} value={option.id}>
              {option.title}
            </option>
          ))}
        </select>
        <div className="form-element--dropdown-with-remove--icon">
          <i className="fas fa-chevron-down"></i>
        </div>
        <div className="form-element--dropdown-with-remove--remove-btn" onClick={onClickRemove}>
          <img src={removeBtn} alt="Remove"></img>
        </div>
      </div>
    </div>
  );
}
export default DropdownRemove;
