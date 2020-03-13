import React from "react";
import moment from "moment";
import ReportStatus from "./ReportStatus";
import ReactTooltip from "react-tooltip";

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
    <div className='landscape-report clickable' onClick={onClick}>
      <div className='landscape-report-left'>
        <div className='landscape-report-left-container'>
          <div className='landscape-report-left-container--title'>{title}</div>

          <div className='landscape-report-left-container--tags'>{tags}</div>

          <div className='landscape-report-left-container--author'>
            {author.first_name} {author.last_name} {author.position ? ", " + author.position : ""}
          </div>
          <div className='landscape-report-left-container--date'>{moment(date).format("Do MMMM YYYY, h:mm:ss a")}</div>
          <div className='landscape-report-left-container--button'>
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
      <div className='landscape-report-right'>
        <div className='landscape-report-right-left-container'>
          <div className='landscape-report-right-left-container--item'>
            <div className='landscape-report-right-left-container--item-title'>Device: </div>
            <div className='landscape-report-right-left-container--item-value'>
              {device[0].title}{" "}
              {device[1] ? <i className='fas fa-info-circle removed-text' data-tip data-for='removed'></i> : ""}
            </div>
          </div>

          <div className='landscape-report-right-left-container--item'>
            <div className='landscape-report-right-left-container--item-title'>Browser:</div>
            <div className='landscape-report-right-left-container--item-value'>
              {browser[0] && browser[0].title}{" "}
              {browser[1] ? <i className='fas fa-info-circle removed-text' data-tip data-for='removed'></i> : ""}
            </div>
          </div>
          <div className='landscape-report-right-left-container--item'>
            <div className='landscape-report-right-left-container--item-title'>Version:</div>
            <div className='landscape-report-right-left-container--item-value'>
              {" "}
              {version[0].version}{" "}
              {version[1] ? <i className='fas fa-info-circle removed-text' data-tip data-for='removed'></i> : ""}
            </div>
          </div>
          <div className='landscape-report-right-left-container--item'>
            <div className='landscape-report-right-left-container--item-title'>Operating System:</div>
            <div className='landscape-report-right-left-container--item-value'>
              {operatingsystem[0].title}{" "}
              {operatingsystem[1] ? (
                <i className='fas fa-info-circle removed-text' data-tip data-for='removed'></i>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='landscape-report-right'>
        <div className='landscape-report-right-right-container'>
          <div className='landscape-report-right-right-container--item'>
            <div className='landscape-report-right-right-container--item-title'>Environment:</div>
            <div className='landscape-report-right-right-container--item-value'>
              {environment[0].title}{" "}
              {environment[1] ? <i className='fas fa-info-circle removed-text' data-tip data-for='removed'></i> : ""}
            </div>
          </div>
          <div className='landscape-report-right-right-container--item'>
            <div className='landscape-report-right-right-container--item-title'>Simulator:</div>
            <div className='landscape-report-right-right-container--item-value'>
              {simulator[0].title}{" "}
              {simulator[1] ? <i className='fas fa-info-circle removed-text' data-tip data-for='removed'></i> : ""}
            </div>
          </div>
          <div className='landscape-report-right-right-container--item'>
            <div className='landscape-report-right-right-container--item-title'>Comment:</div>
            <div className='landscape-report-right-right-container--item-value'>{comment}</div>
          </div>
          <div className='landscape-report-right-right-container--item'>
            <div className='landscape-report-right-right-container--item-title'>Actual Result:</div>
            <div className='landscape-report-right-right-container--item-value'>{actual_result}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandscapeTestCase;
