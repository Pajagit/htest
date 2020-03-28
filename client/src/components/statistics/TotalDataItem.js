import React from "react";
import ReactTooltip from "react-tooltip";

function TotalDataItem({ className, totalDataCount, totalDataCountPercentage, totalDataRatio, days }) {
  var title = "";
  var dataForValue = "";
  var textColor = "";
  var backGroundColor = "";
  var toolTipRatioValue = "";
  var toolTipClass = "";
  var statsGridClass = "";
  var percentageLabel = " %";
  var daysValue;
  switch (days) {
    case 1:
      daysValue = "3 days";
      break;
    case 2:
      daysValue = "week";
      break;
    case 3:
      daysValue = "month";
      break;
    case 4:
      daysValue = "3 months";
      break;
    case 5:
      daysValue = "6 month";
      break;
    case 6:
      daysValue = "year";
      break;
    default:
      daysValue = null;
  }
  var toolTipPercentageValue = `Change percentage compared to previous ${daysValue}`;
  if (className === "failed") {
    title = "Failed Reports";
    dataForValue = "failed";
    textColor = "#fff";
    backGroundColor = "#ff4560";
    toolTipRatioValue = "Percentage of failed reports based on total reports in selected time frame";
    toolTipClass = "failed-text";
    statsGridClass = "4";
  } else if (className === "passed") {
    title = "Passed Reports";
    dataForValue = "passed";
    textColor = "#000";
    backGroundColor = "#00e396";
    toolTipRatioValue = "Percentage of passed reports based on total reports in selected time frame";
    toolTipClass = "passed-text";
    statsGridClass = "3";
  } else if (className === "reports") {
    title = "Total Reports";
    dataForValue = "total-reports";
    textColor = "#fff";
    backGroundColor = "#503bbc";
    toolTipRatioValue = "Reports / Test Cases ratio in selected time frame";
    toolTipClass = "primary-text";
    statsGridClass = "2";
    percentageLabel = "";
  } else if (className === "testcases") {
    title = "Total Test Cases";
    dataForValue = "total-testcases";
    textColor = "#000";
    backGroundColor = "#a592ff";
    toolTipRatioValue = "Reports / Test Cases ratio";
    toolTipClass = "secondary-text";
    statsGridClass = "1";
    percentageLabel = "";
  }
  var totalDataCountPercentageValue = "Can not compare";
  var totalDataCountValue = "0";
  if (totalDataCount) {
    totalDataCountValue = totalDataCount;
  }
  if (totalDataCountPercentage) {
    totalDataCountPercentageValue =
      totalDataCountPercentage >= 0 ? "+" + totalDataCountPercentage + " %" : totalDataCountPercentage + " %";
  } else if (totalDataCountPercentage === 0) {
    totalDataCountPercentage = "No changes";
  }
  var totalDataCountPercentageComponent = "";
  if (days) {
    totalDataCountPercentageComponent = (
      <div>
        {totalDataCountPercentageValue}
        <i className={`fas fa-info-circle ml-0 ${toolTipClass}`} data-tip data-for={dataForValue + "-percentage"}></i>
        <ReactTooltip
          id={dataForValue + "-percentage"}
          aria-haspopup='true'
          className='custom-color-no-arrow'
          textColor={textColor}
          backgroundColor={backGroundColor}
          effect='solid'
        >
          <p>{toolTipPercentageValue}</p>
        </ReactTooltip>
      </div>
    );
  }

  var totalDataRatioValueComponent = "";
  var totalDataRatioValue = "";
  if (totalDataRatio) {
    totalDataRatioValue = totalDataRatio + percentageLabel;
  } else {
    totalDataRatioValue = "Can't calculate";
  }
  if (className !== "testcases") {
    totalDataRatioValueComponent = (
      <div>
        {totalDataRatioValue}
        <i className={`fas fa-info-circle ml-0 ${toolTipClass}`} data-tip data-for={dataForValue + "-ratio"}></i>
        <ReactTooltip
          id={dataForValue + "-ratio"}
          aria-haspopup='true'
          className='custom-color-no-arrow'
          textColor={textColor}
          backgroundColor={backGroundColor}
          effect='solid'
        >
          <p>{toolTipRatioValue}</p>
        </ReactTooltip>
      </div>
    );
  }

  return (
    <div className='stats-grid--item'>
      <div className={`stats-grid--item-${statsGridClass}`}>
        <div className='stats-grid--item-1-title'>{title}</div>
        <div className='stats-grid--item-1-count'>
          {totalDataCountValue}
          <div className='stats-grid--item-1-count-percentage'>{totalDataCountPercentageComponent}</div>
        </div>
        <div className='stats-grid--item-1-ratio'>{totalDataRatioValueComponent}</div>
      </div>
    </div>
  );
}

export default TotalDataItem;
