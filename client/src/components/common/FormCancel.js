import React from "react";

function FormCancel({ link, value }) {
  return (
    <div className="form-cancel">
      <a href={link}>{value}</a>
    </div>
  );
}
export default FormCancel;
