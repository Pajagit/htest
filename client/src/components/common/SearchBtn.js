import React from "react";

export default function SearchBtn({ value, onChange, searchActive, onKeyDown }) {
  var isActive = "";
  if (searchActive !== "") {
    isActive = (
      <div className='main-content--header-buttons-item-warning'>
        <i className='fas fa-circle'></i>
      </div>
    );
  }
  return (
    <div className={`main-content--header-buttons-item-search mr-1`}>
      {isActive}
      <div id='search-input'>
        <input onChange={onChange} onKeyDown={onKeyDown} type='search' value={value} className='form-element--input' />
      </div>
    </div>
  );
}
