import React from "react";

function FilterBtn({ onClick }) {
  return (
    <div onClick={onClick} className="main-content--header-buttons-item">
      <i className="fas fa-filter"></i>
    </div>
  );
}
export default FilterBtn;
