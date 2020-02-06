import React from "react";
import moment from "moment";
import ReportStatus from "./ReportStatus";
import Tag from "./Tag";

function LandscapeTestCase({
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
  return (
    <div className="landscape-report clickable" onClick={onClick}>
      <div className="landscape-report-left">
        <div className="landscape-report-left-container">
          <div className="landscape-report-left-container--title">{title}</div>

          <div className="landscape-report-left-container--tags">
            <Tag title="Login" color="DARK_KHAKI" isRemovable={false} />
            <Tag title="Regression" color="MEDIUM_SEA_GREEN" isRemovable={false} />
          </div>

          <div className="landscape-report-left-container--author">
            {author.first_name} {author.last_name} {author.position ? ", " + author.position : ""}
          </div>
          <div className="landscape-report-left-container--date">{moment(date).format("Do MMMM YYYY, h:mm:ss a")}</div>
          <div className="landscape-report-left-container--button">
            <ReportStatus status={status.title.toLowerCase()} id={id} />
          </div>
        </div>
      </div>

      <div className="landscape-report-right">
        <div className="landscape-report-right-left-container">
          <div className="landscape-report-right-left-container--item">
            <div className="landscape-report-right-left-container--item-title">Device:</div>
            <div className="landscape-report-right-left-container--item-value">{device.title}</div>
          </div>
          <div className="landscape-report-right-left-container--item">
            <div className="landscape-report-right-left-container--item-title">Browser:</div>
            <div className="landscape-report-right-left-container--item-value">{browser.title}</div>
          </div>
          <div className="landscape-report-right-left-container--item">
            <div className="landscape-report-right-left-container--item-title">Version:</div>
            <div className="landscape-report-right-left-container--item-value">{version.version}</div>
          </div>
          <div className="landscape-report-right-left-container--item">
            <div className="landscape-report-right-left-container--item-title">Operating System:</div>
            <div className="landscape-report-right-left-container--item-value">{operatingsystem.title}</div>
          </div>
        </div>
      </div>
      <div className="landscape-report-right">
        <div className="landscape-report-right-right-container">
          <div className="landscape-report-right-right-container--item">
            <div className="landscape-report-right-right-container--item-title">Environment:</div>
            <div className="landscape-report-right-right-container--item-value">{environment.title}</div>
          </div>
          <div className="landscape-report-right-right-container--item">
            <div className="landscape-report-right-right-container--item-title">Comment:</div>
            <div className="landscape-report-right-right-container--item-value">{comment}</div>
          </div>
          <div className="landscape-report-right-right-container--item">
            <div className="landscape-report-right-right-container--item-title">Actual Result:</div>
            <div className="landscape-report-right-right-container--item-value">{actual_result}</div>
          </div>
          <div className="landscape-report-right-right-container--item">
            <div className="landscape-report-right-right-container--item-title">Simulator:</div>
            <div className="landscape-report-right-right-container--item-value">{simulator.title}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandscapeTestCase;
