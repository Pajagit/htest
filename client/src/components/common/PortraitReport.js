import React from "react";
import ReportStatus from "./ReportStatus";
import Tag from "./Tag";
import moment from "moment";

function PortraitReport({ title, tags, author, date, description, id, projectId, onClick, isValidWrite }) {
  var addReportBtn = "";

  return (
    <div className="portrait-report clickable" onClick={onClick}>
      <div className="portrait-report-top">
        <div className="portrait-report-top-container">
          <div className="portrait-report-top-container--title">Title</div>

          <div className="portrait-report-top-container--tags"> <Tag title="Login" color="DARK_KHAKI" isRemovable={false} />
            <Tag title="Regression" color="MEDIUM_SEA_GREEN" isRemovable={false} /></div>

          <div className="portrait-report-top-container--author">
            Aleksandar Pavlovic, QA
          </div>
          <div className="portrait-report-top-container--date">9th January 2020, 9:06:32 pm</div>
          <div className="portrait-report-top-container--button">
            <ReportStatus status={"failed"} id={id} />
          </div>
        </div>
      </div>

      <div className="portrait-report-bottom">
        <div className="portrait-report-bottom-container">
          <div className="portrait-report-bottom-container--item">
            <div className="portrait-report-bottom-container--item-title">
              Device:
            </div>
            <div className="portrait-report-bottom-container--item-value">
              Samsung Galaxy A7
            </div>
          </div>
          <div className="portrait-report-bottom-container--item">
            <div className="portrait-report-bottom-container--item-title">
              Browser:
            </div>
            <div className="portrait-report-bottom-container--item-value">
              Google Chrome
            </div>
          </div>
          <div className="portrait-report-bottom-container--item">
            <div className="portrait-report-bottom-container--item-title">
              Version:
            </div>
            <div className="portrait-report-bottom-container--item-value">
              Version 2.1
            </div>
          </div>
          <div className="portrait-report-bottom-container--item">
            <div className="portrait-report-bottom-container--item-title">
              Operating System:
            </div>
            <div className="portrait-report-bottom-container--item-value">
              Android
            </div>
          </div>

          <div className="portrait-report-bottom-container--item">
            <div className="portrait-report-bottom-container--item-title">
              Environment:
            </div>
            <div className="portrait-report-bottom-container--item-value">
              Development
            </div>
          </div>
          <div className="portrait-report-bottom-container--item">
            <div className="portrait-report-bottom-container--item-title">
              Comment:
            </div>
            <div className="portrait-report-bottom-container--item-value">
              Additional comment goes here
            </div>
          </div>
          <div className="portrait-report-bottom-container--item">
            <div className="portrait-report-bottom-container--item-title">
              Actual Result:
            </div>
            <div className="portrait-report-bottom-container--item-value">
              Actual result goes here
            </div>
          </div>
          <div className="portrait-report-bottom-container--item">
            <div className="portrait-report-bottom-container--item-title">
              Simulator:
            </div>
            <div className="portrait-report-bottom-container--item-value">
              iPhone 7
            </div>
          </div>
          <br /><br />

        </div>

      </div>
    </div>
  );
}

export default PortraitReport;
