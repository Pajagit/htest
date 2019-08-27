import React from "react";
import FormElementTitle from "../components/FormElementTitle";
import Select from "react-dropdown-select";

function SearchDropdown({ className, onChange, placeholder, options, label }) {
  return (
    <div className="form-element">
      <div className="form-element-item">
        <FormElementTitle label={label} />
      </div>

      <div className="form-element-item">
        <div className="select-dropdown">
          <div className="select-dropdown--icon">
            <i className="fas fa-search"></i>
          </div>

          <Select
            placeholder={placeholder}
            options={options}
            onChange={onChange}
            dropdownPosition={"auto"}
            multi={true}
            clearable={true}
            keepSelectedInList={false}
            closeOnScroll={true}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchDropdown;
