import React from "react";

export default function FilterBtn({ onClick, activeFilters, filtersShown }) {
  var isActive = "";
  if (activeFilters) {
    isActive = (
      <div className="main-content--header-buttons-item-warning">
        <i className="fas fa-circle"></i>
      </div>
    );
  }

  var btnClicked = "";
  if (filtersShown) {
    btnClicked = "active-filter-btn";
  }

  return (
    <div onClick={onClick} className={`main-content--header-buttons-item ${btnClicked}`}>
      {isActive}
      <i className="fas fa-filter"></i>
    </div>
  );
}
