import React from "react";
import FormElementTitle from "../form/FormElementTitle";
import DayPicker from "react-daypicker";
import "react-daypicker/lib/DayPicker.css";

export default function Datepicker({
  name,
  placeholder,
  label,
  validationMsg,
  showdatepicker,
  timestamp,
  onChange,
  onClick,
  onDayClick,
  selectedDate,
  id,
  forwardRef
}) {
  var datepicker = <div className="datepicker" ref={forwardRef}></div>;
  var activeDate;
  if (selectedDate === new Date()) {
    activeDate = new Date();
  } else {
    activeDate = timestamp;
  }
  if (showdatepicker) {
    datepicker = <DayPicker active={activeDate} onDayClick={onDayClick} />;
  }
  var dateValue;
  if (!selectedDate) {
    dateValue = label;
  } else {
    dateValue = selectedDate;
  }
  return (
    <div className="form-element" ref={forwardRef}>
      <div className="form-element-item">
        <FormElementTitle label={label} validationMsg={validationMsg} />
      </div>
      <div className="form-element-item ">
        <input
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          name={name}
          value={dateValue}
          showdatepicker={showdatepicker.toString()}
          readOnly
          className={"form-element--input datepicker noselect"}
          onClick={onClick}
        />
      </div>
      {datepicker}
    </div>
  );
}
