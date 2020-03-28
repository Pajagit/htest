import React from "react";
import ReportStatus from "./ReportStatus";
import ReactTooltip from "react-tooltip";
import AddReportBtn from "../common/AddReportBtn";
import Tag from "./Tag";

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
  onClickAddReport,
  deprecated,
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
  if (device[0].title) {
    deviceValue = (
      <div className='portrait-report-bottom-container--item'>
        <div className='portrait-report-bottom-container--item-title'>Device:</div>
        <div className='portrait-report-bottom-container--item-value'>
          {device[0].title}{" "}
          {device[1] ? <i className='fas fa-info-circle removed-text' data-tip data-for='removed'></i> : ""}
        </div>
      </div>
    );
  }
  if (browser[0].title) {
    browserValue = (
      <div className='portrait-report-bottom-container--item'>
        <div className='portrait-report-bottom-container--item-title'>Browser:</div>
        <div className='portrait-report-bottom-container--item-value'>
          {browser[0].title}{" "}
          {browser[1] ? <i className='fas fa-info-circle removed-text' data-tip data-for='removed'></i> : ""}
        </div>
      </div>
    );
  }
  if (version[0].version) {
    versionValue = (
      <div className='portrait-report-bottom-container--item'>
        <div className='portrait-report-bottom-container--item-title'>Version:</div>
        <div className='portrait-report-bottom-container--item-value'>
          {version[0].version}{" "}
          {version[1] ? <i className='fas fa-info-circle removed-text' data-tip data-for='removed'></i> : ""}
        </div>
      </div>
    );
  }
  if (operatingsystem[0].title) {
    operatingSystemValue = (
      <div className='portrait-report-bottom-container--item'>
        <div className='portrait-report-bottom-container--item-title'>Operating System:</div>
        <div className='portrait-report-bottom-container--item-value'>
          {operatingsystem[0].title}{" "}
          {operatingsystem[1] ? <i className='fas fa-info-circle removed-text' data-tip data-for='removed'></i> : ""}
        </div>
      </div>
    );
  }
  if (environment[0].title) {
    environmentValue = (
      <div className='portrait-report-bottom-container--item'>
        <div className='portrait-report-bottom-container--item-title'>Environment:</div>
        <div className='portrait-report-bottom-container--item-value'>
          {environment[0].title}{" "}
          {environment[1] ? <i className='fas fa-info-circle removed-text' data-tip data-for='removed'></i> : ""}
        </div>
      </div>
    );
  }
  if (comment) {
    commentValue = (
      <div className='portrait-report-bottom-container--item'>
        <div className='portrait-report-bottom-container--item-title'>Comment:</div>
        <div className='portrait-report-bottom-container--item-value'>{comment}</div>
      </div>
    );
  }
  if (actual_result) {
    actualResultValue = (
      <div className='portrait-report-bottom-container--item'>
        <div className='portrait-report-bottom-container--item-title'>Actual Result:</div>
        <div className='portrait-report-bottom-container--item-value'>{actual_result}</div>
      </div>
    );
  }
  if (simulator[0].title) {
    simulatorValue = (
      <div className='portrait-report-bottom-container--item'>
        <div className='portrait-report-bottom-container--item-title'>Simulator:</div>
        <div className='portrait-report-bottom-container--item-value'>
          {simulator[0].title}{" "}
          {simulator[1] ? <i className='fas fa-info-circle removed-text' data-tip data-for='removed'></i> : ""}
        </div>
      </div>
    );
  }
  var addReportBtn = "";
  if (isValidWrite) {
    if (!deprecated) {
      addReportBtn = (
        <div className='portrait-testcase-bottom-container--button' onClick={onClickAddReport}>
          <AddReportBtn title={"Retest"} id={id} />
        </div>
      );
    } else {
      addReportBtn = (
        <div className={`portrait-testcase-bottom-container--button primary-text deprecated`}>
          <i className={`fas fa-trash-alt`} data-tip data-for={"deprecated"}></i>
        </div>
      );
    }
  }

  var spliceCount = 0;
  var totalCount = tags.length;
  var array = tags;
  if (tags.length > 5) {
    array.splice(5, totalCount);
    spliceCount = totalCount - tags.length;
  }
  if (spliceCount > 0) {
    tags.push(<Tag title={`+ ${spliceCount}`} color={"PRIMARY"} key={"bonus"} />);
  }
  return (
    <div className='portrait-report clickable' onClick={onClick}>
      <div className='portrait-report-top'>
        <div className='portrait-report-top-container'>
          <div className='portrait-report-top-container--title'>{title}</div>

          <div className='portrait-report-top-container--tags'>{tags}</div>

          <div className='portrait-report-top-container--author'>
            {author.first_name} {author.last_name} {author.position ? ", " + author.position : ""}
          </div>
          <div className='portrait-report-top-container--date'>{moment(date).format("Do MMMM YYYY, h:mm:ss a")}</div>
          <div className='portrait-report-top-container--button'>
            <ReportStatus status={status.title.toLowerCase()} id={id} />
          </div>
        </div>
      </div>
      <ReactTooltip
        id='removed'
        aria-haspopup='true'
        className='custom-color-no-arrow'
        textColor='#fff'
        backgroundColor='#4d3cb5'
        effect='solid'
      >
        <p>This setup item is removed.</p>
        <p>You can not filter or create</p>
        <p> new report with this item.</p>
      </ReactTooltip>
      <ReactTooltip
        id='deprecated'
        aria-haspopup='true'
        className='custom-color-no-arrow'
        textColor='#fff'
        backgroundColor='#4d3cb5'
        effect='solid'
      >
        <p>Can not retest removed test case</p>
      </ReactTooltip>
      <div className='portrait-report-bottom'>
        <div className='portrait-report-bottom-container'>
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
          <br />
          {addReportBtn}
        </div>
      </div>
    </div>
  );
}

export default PortraitReport;
