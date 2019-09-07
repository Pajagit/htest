import React from "react";
import FormElementTitle from "../form/FormElementTitle";

function FullBtn({ label, placeholder, onClick }) {
  return (
    <div className="form-element" onClick={onClick}>
      <div className="form-element-item">
        <FormElementTitle label={label} />
      </div>
      <div className="form-element-item">
        <div className="full-width-btn">
          <div className="full-width-btn--label">{placeholder}</div>
          <div className="full-width-btn--icon">
            <i className="fas fa-clone"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullBtn;
