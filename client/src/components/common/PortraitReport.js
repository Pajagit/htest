import React from "react";
import ReportStatus from "../common/ReportStatus";
import moment from "moment";

function PortraitReport({
  title,
  tags,
  author,
  date,
  device,
  version,
  browser,
  environment,
  id,
  status,
  operatingSystem,
  projectId,
  onClick
}) {
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
        </div>
      </div>

      <div className="portrait-report-bottom">
        <div className="portrait-report-bottom-container">
          {/* <div className="portrait-report-bottom-container--description">{description}</div> */}
          <div className="portrait-report-bottom-container--item">
            <div className="portrait-report-bottom-container--item-title">Device:</div>
            <div className="portrait-report-bottom-container--item-value">{device}</div>
          </div>
          <div className="portrait-report-bottom-container--item">
            <div className="portrait-report-bottom-container--item-title">Browser:</div>
            <div className="portrait-report-bottom-container--item-value">{browser}</div>
          </div>
          <div className="portrait-report-bottom-container--item">
            <div className="portrait-report-bottom-container--item-title">Version:</div>
            <div className="portrait-report-bottom-container--item-value">{version}</div>
          </div>
          <div className="portrait-report-bottom-container--item">
            <div className="portrait-report-bottom-container--item-title">Device:</div>
            <div className="portrait-report-bottom-container--item-value">{device}</div>
          </div>
          <div className="portrait-report-bottom-container--item">
            <div className="portrait-report-bottom-container--item-title">Operating System:</div>
            <div className="portrait-report-bottom-container--item-value">{operatingSystem}</div>
          </div>
          <div className="portrait-report-bottom-container--item">
            <div className="portrait-report-bottom-container--item-title">Environment:</div>
            <div className="portrait-report-bottom-container--item-value">{environment}</div>
          </div>
          <div className="portrait-report-bottom-container--item">
            <div className="portrait-report-bottom-container--item-title"></div>
            <div className="portrait-report-bottom-container--item-value"></div>
          </div>
          <div className="portrait-report-bottom-container--item">
            <div className="portrait-report-bottom-container--item-title"></div>
            <div className="portrait-report-bottom-container--item-value"></div>
          </div>
          <div className="portrait-report-bottom-container--button">
            <ReportStatus status={status} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortraitReport;
