import React from "react";
import { Link } from "react-router-dom";

function AddReportBtn({ title, id }) {
  return (
    <Link to={`/Testcase/${id}`}>
      <div className="addReportBtn">
        <div className="addReportBtn--title">{title}</div>
        <div className="addReportBtn--icon">
          <i className="fas fa-angle-double-right"></i>
        </div>
      </div>
    </Link>
  );
}
export default AddReportBtn;