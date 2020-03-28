import React from "react";
import AddReportBtn from "../common/AddReportBtn";
import Tag from "./Tag";
import moment from "moment";

function PortraitTestCase({ title, tags, author, date, description, id, onClick, isValidWrite, onClickAddReport }) {
  var addReportBtn = "";
  if (isValidWrite) {
    addReportBtn = (
      <div className='portrait-testcase-bottom-container--button' onClick={onClickAddReport}>
        <AddReportBtn title={"Test"} id={id} />
      </div>
    );
  }

  var tagsToShow = 8;
  var spliceCount = 0;
  var totalCount = tags.length;
  var array = tags;
  if (tags.length > tagsToShow) {
    array.splice(tagsToShow, totalCount);
    spliceCount = totalCount - tags.length;
  }
  if (spliceCount > 0) {
    tags.push(<Tag title={`+ ${spliceCount} other`} color={"PRIMARY"} key={"bonus"} />);
  }
  return (
    <div className='portrait-testcase clickable' onClick={onClick}>
      <div className='portrait-testcase-top'>
        <div className='portrait-testcase-top-container'>
          <div className='portrait-testcase-top-container--title'>{title}</div>

          <div className='portrait-testcase-top-container--tags'>{tags}</div>

          <div className='portrait-testcase-top-container--author'>
            {author.first_name} {author.last_name} {author.position ? ", " + author.position : ""}
          </div>
          <div className='portrait-testcase-top-container--date'>{moment(date).format("Do MMMM YYYY, h:mm:ss a")}</div>
        </div>
      </div>

      <div className='portrait-testcase-bottom'>
        <div className='portrait-testcase-bottom-container'>
          <div className='portrait-testcase-bottom-container--description'>{description}</div>
          {addReportBtn}
        </div>
      </div>
    </div>
  );
}

export default PortraitTestCase;
