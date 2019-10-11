import React from "react";

export default function FilterBtn({ onClick, activeFilters }) {
  var isActive = "";
  if (activeFilters) {
    isActive = (
      <div className="main-content--header-buttons-item-warning">
        <i className="fas fa-exclamation-triangle"></i>
      </div>
    );
  }
  return (
    <div onClick={onClick} className={`main-content--header-buttons-item`}>
      {isActive}
      <i className="fas fa-filter"></i>
    </div>
  );
}
