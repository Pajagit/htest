import React from "react";
import FormElementTitle from "../form/FormElementTitle";
import RemoveColumnBtn from "../common/RemoveColumnBtn";
// import FullBtn from "./FullBtn";

function InputGroup({
  className,
  type,
  label,
  validationMsg,
  placeholder,
  values,
  onChange,
  addColumn,
  id,
  removeColumn,
  required,
  disabled,
  onKeyDown
}) {
  return (
    <div className="form-element">
      <div className="form-element-item">
        <FormElementTitle label={label} validationMsg={validationMsg} />
      </div>
      {values.map((value, index) => (
        <div className="form-element-item" key={index}>
          <input
            type={type}
            placeholder={placeholder}
            value={value.value}
            className="form-element--input"
            onChange={onChange}
            disabled={disabled}
            name={`${id}-${index}`}
            onKeyDown={onKeyDown}
            id={id}
          />
          {required === false ? <RemoveColumnBtn index={`${id}-${index}`} onClick={removeColumn} /> : ""}
          {values.length > 1 ? <RemoveColumnBtn index={`${id}-${index}`} onClick={removeColumn} /> : ""}
        </div>
      ))}
      {addColumn}
    </div>
  );
}

export default InputGroup;
