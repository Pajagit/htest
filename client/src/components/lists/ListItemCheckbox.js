import React from "react";
import Checkbox from "../common/Checkbox";

function ListItemCheckbox({ title, checkboxText, value, onClick }) {
  var content = "";

  content = (
    <div className='list-item'>
      <div className='list-item--text'>
        <div className='list-item--text--title'>{title}</div>
      </div>
      <div className='list-item--checkbox'>
        <Checkbox label={checkboxText} value={value} onClick={onClick} />
      </div>
    </div>
  );

  return <div>{content}</div>;
}
export default ListItemCheckbox;
