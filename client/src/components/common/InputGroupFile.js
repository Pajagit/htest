import React from "react";
import FormElementTitle from "../form/FormElementTitle";

function FullBtnFile({ label, placeholder }) {
  return (
    <div className="form-element">
      <div className="form-element-item">
        <FormElementTitle label={label} />
      </div>
      <div className="form-element-item">
        <label className="full-width-btn">
          <input
            className="centered-image rounded-circle"
            type="file"
            name="image"
            // onChange={this.onChangePhoto}
            // value={""}
          />
          <div className="full-width-btn--label">{placeholder}</div>
          <div className="full-width-btn--icon">
            <i className="fas fa-upload"></i>
          </div>
        </label>
      </div>
    </div>
  );
}

export default FullBtnFile;
