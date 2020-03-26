import React from "react";
import isEmpty from "../../validation/isEmpty";
import FormElementTitle from "../form/FormElementTitle";

function Dropdown({ options, placeholder, value, label, validationMsg, onChange, name }) {
  var placeholderValue = "";
  if (isEmpty(value)) {
    placeholderValue = (
      <option value='0' className='default'>
        {placeholder}
      </option>
    );
  }

  return (
    <div className='form-element'>
      <div className='form-element-item'>
        <FormElementTitle label={label} validationMsg={validationMsg} />
      </div>
      <select className='form-element--dropdown' onChange={onChange} name={name} value={value}>
        {placeholderValue}

        {options.map((option, index) => (
          <option key={index} value={option.id}>
            {option.title}
          </option>
        ))}
      </select>
      <span className='form-element--dropdown--icon'>
        <i className='fas fa-chevron-down'></i>
      </span>
    </div>
  );
}
export default Dropdown;
