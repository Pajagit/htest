import React from "react";
import FormElementTitle from "../form/FormElementTitle";
import RemoveDoubleColumn from "../common/RemoveDoubleColumn";

function InputGroupDouble({
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
  keys,
  required,
  disabled,
  onKeyDown
}) {
  return (
    <div className='form-element'>
      <div className='form-element-item'>
        <FormElementTitle label={label} validationMsg={validationMsg} />
      </div>

      {values.map((value, index) => (
        <div key={index}>
          <div className='form-element-item' key={index}>
            <input
              type={type}
              placeholder={placeholder[0]}
              value={value[`${keys[0]}`]}
              className='form-element--input'
              onChange={onChange}
              disabled={disabled}
              name={`${id[0]}-${index}`}
              onKeyDown={onKeyDown}
              id={[id[0], index]}
            />
            {required === false ? <RemoveDoubleColumn index={`${id}-${index}`} onClick={removeColumn} /> : ""}
            {values.length > 1 ? <RemoveDoubleColumn index={`${id}-${index}`} onClick={removeColumn} /> : ""}
          </div>
          <div className='form-element-item' key={index + "exp"}>
            <input
              type={type}
              placeholder={placeholder[1]}
              value={value[`${keys[1]}`]}
              className='form-element--input'
              onChange={onChange}
              disabled={disabled}
              name={`${id[1]}-${index}`}
              onKeyDown={onKeyDown}
              id={[id[1], index]}
            />
          </div>
          <br />
        </div>
      ))}
      {addColumn}
    </div>
  );
}

export default InputGroupDouble;
