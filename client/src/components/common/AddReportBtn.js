import React from "react";

function AddReportBtn({ title }) {
  return (
    <div className={`addReportBtn`}>
      <div className='addReportBtn--title'>{title}</div>
      <div className='addReportBtn--icon'>
        <i className='fas fa-angle-double-right'></i>
      </div>
    </div>
  );
}
export default AddReportBtn;
