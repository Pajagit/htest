import React from "react";

export default function ReportStatus({ status }) {
  const capitalize = s => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  return (
    <div className={`report-status-${status}`}>
      <div className={`report-status-${status}-title`}>Status:</div>
      <div className={`report-status-${status}-value`}>{capitalize(status)}</div>
    </div>
  );
}
