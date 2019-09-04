import React from "react";

export default function FilterBtn({ onClick }) {
  return (
    <div onClick={onClick} className="main-content--header-buttons-item">
      <i className="fas fa-filter"></i>
    </div>
  );
}
