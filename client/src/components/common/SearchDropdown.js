import React from "react";
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
  numberDisplayed
}) {
  return (
    <div className="form-element">
      <div className="form-element-item">
        <FormElementTitle label={label} validationMsg={validationMsg} />
      </div>

      <div className="form-element-item">
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
            valueKey="id"
            labelKey="name"
            multiple={multiple}
            includeSelectAll={true}
            includeFilter={true}
            dropdownHeight={300}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchDropdown;
