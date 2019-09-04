import React from "react";

export default function SearchBtn() {
  return (
    <div className="main-content--header-buttons-item">
      <div className="main-content--header-buttons-item-search">
        <input className="search-input" type="text"></input>
        <i className="fas fa-search"></i>
      </div>
    </div>
  );
}
