import React from "react";
import FormElementTitle from "../components/FormElementTitle";
import "react-picky/dist/picky.css";
import Picky from "react-picky";

function SearchDropdown({ className, onChange, placeholder, options, label, value }) {
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
          <Picky
            value={value}
            options={options}
            onChange={onChange}
            placeholder={placeholder}
            open={false}
            valueKey="id"
            labelKey="name"
            multiple={true}
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
