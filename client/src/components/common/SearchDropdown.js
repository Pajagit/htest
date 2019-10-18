import React from "react";

import isEmpty from "../../validation/isEmpty";

import FormElementTitle from "../form/FormElementTitle";
import "react-picky/dist/picky.css";
import Picky from "react-picky";

function SearchDropdown({
  className,
  onChange,
  placeholder,
  options,
  label,
  value,
  validationMsg,
  id,
  multiple,
  name,
  numberDisplayed
}) {
  var disabled = false;
  var includeSelectAll = true;
  var includeFilter = true;
  var disabledDropdownSelect = "";
  if (isEmpty(options)) {
    disabled = true;
    includeSelectAll = false;
    includeFilter = false;
    disabledDropdownSelect = "disabled-light";
    value = [{ id: 0, title: `No available ${placeholder.toLowerCase()}` }];
  }
  return (
    <div className="form-element">
      <div className="form-element-item">
        <FormElementTitle label={label} validationMsg={validationMsg} />
      </div>

      <div className={`form-element-item ${disabledDropdownSelect}`}>
        <div className="select-dropdown">
          <div className="select-dropdown--icon">
            <i className="fas fa-search"></i>
          </div>
          <Picky
            id={id}
            value={value}
            options={options}
            onChange={onChange}
            placeholder={placeholder}
            numberDisplayed={numberDisplayed}
            open={false}
            name={name}
            disabled={disabled}
            valueKey="id"
            labelKey="title"
            multiple={multiple}
            includeSelectAll={includeSelectAll}
            defaultFocusFilter={true}
            includeFilter={includeFilter}
            keepOpen={false}
            dropdownHeight={300}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchDropdown;
