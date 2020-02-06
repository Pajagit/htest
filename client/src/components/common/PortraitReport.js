import React from "react";
import ReportStatus from "./ReportStatus";
import moment from "moment";

function PortraitReport({
  title,
  tags,
  author,
  date,
  device,
  id,
  browser,
  version,
  operatingsystem,
  environment,
  simulator,
  comment,
  actual_result,
  status,
  onClick,
  isValidWrite
}) {
  var deviceValue = "";
  var browserValue = "";
  var versionValue = "";
  var operatingSystemValue = "";
  var environmentValue = "";
  var commentValue = "";
  var actualResultValue = "";
  var simulatorValue = "";
  if (device.title) {
    deviceValue = (
      <div className="portrait-report-bottom-container--item">
        <div className="portrait-report-bottom-container--item-title">Device:</div>
        <div className="portrait-report-bottom-container--item-value">{device.title}</div>
      </div>
    );
  }
  if (browser.title) {
    browserValue = (
      <div className="portrait-report-bottom-container--item">
        <div className="portrait-report-bottom-container--item-title">Browser:</div>
        <div className="portrait-report-bottom-container--item-value">{browser.title}</div>
      </div>
    );
  }
  if (version.version) {
    versionValue = (
      <div className="portrait-report-bottom-container--item">
        <div className="portrait-report-bottom-container--item-title">Version:</div>
        <div className="portrait-report-bottom-container--item-value">{version.version}</div>
      </div>
    );
  }
  if (operatingsystem.title) {
    operatingSystemValue = (
      <div className="portrait-report-bottom-container--item">
        <div className="portrait-report-bottom-container--item-title">Operating System:</div>
        <div className="portrait-report-bottom-container--item-value">{operatingsystem.title}</div>
      </div>
    );
  }
  if (environment.title) {
    environmentValue = (
      <div className="portrait-report-bottom-container--item">
        <div className="portrait-report-bottom-container--item-title">Environment:</div>
        <div className="portrait-report-bottom-container--item-value">{environment.title}</div>
      </div>
    );
  }
  if (comment) {
    commentValue = (
      <div className="portrait-report-bottom-container--item">
        <div className="portrait-report-bottom-container--item-title">Comment:</div>
        <div className="portrait-report-bottom-container--item-value">{comment}</div>
      </div>
    );
  }
  if (actual_result) {
    actualResultValue = (
      <div className="portrait-report-bottom-container--item">
        <div className="portrait-report-bottom-container--item-title">Actual Result:</div>
        <div className="portrait-report-bottom-container--item-value">{actual_result}</div>
      </div>
    );
  }
  if (simulator.title) {
    simulatorValue = (
      <div className="portrait-report-bottom-container--item">
        <div className="portrait-report-bottom-container--item-title">Simulator:</div>
        <div className="portrait-report-bottom-container--item-value">{simulator.title}</div>
      </div>
    );
  }
  return (
    <div className="portrait-report clickable" onClick={onClick}>
      <div className="portrait-report-top">
        <div className="portrait-report-top-container">
          <div className="portrait-report-top-container--title">{title}</div>

          <div className="portrait-report-top-container--tags">{tags}</div>

          <div className="portrait-report-top-container--author">
            {author.first_name} {author.last_name} {author.position ? ", " + author.position : ""}
          </div>
          <div className="portrait-report-top-container--date">{moment(date).format("Do MMMM YYYY, h:mm:ss a")}</div>
          <div className="portrait-report-top-container--button">
            <ReportStatus status={status.title.toLowerCase()} id={id} />
          </div>
        </div>
      </div>

      <div className="portrait-report-bottom">
        <div className="portrait-report-bottom-container">
          {deviceValue}
          {browserValue}
          {versionValue}
          {operatingSystemValue}
          {environmentValue}
          {simulatorValue}
          {commentValue}
          {actualResultValue}
          <br />
          <br />
        </div>
      </div>
    </div>
  );
}

export default PortraitReport;
