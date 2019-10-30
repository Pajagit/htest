import React from "react";
import AddReportBtn from "../common/AddReportBtn";
import moment from "moment";

function PortraitTestCase({ title, tags, author, date, description, id, projectId, onClick, isValidWrite }) {
  var addReportBtn = "";
  if (isValidWrite) {
    addReportBtn = (
      <div className="portrait-testcase-bottom-container--button">
        <AddReportBtn title={"Add to Report"} id={id} />
      </div>
    );
  }
  return (
    <div className="portrait-testcase clickable" onClick={onClick}>
      <div className="portrait-testcase-top">
        <div className="portrait-testcase-top-container">
          <div className="portrait-testcase-top-container--title">{title}</div>

          <div className="portrait-testcase-top-container--tags">{tags}</div>

          <div className="portrait-testcase-top-container--author">
            {author.first_name} {author.last_name} {author.position ? ", " + author.position : ""}
          </div>
          <div className="portrait-testcase-top-container--date">{moment(date).format("Do MMMM YYYY, h:mm:ss a")}</div>
        </div>
      </div>

      <div className="portrait-testcase-bottom">
        <div className="portrait-testcase-bottom-container">
          <div className="portrait-testcase-bottom-container--description">{description}</div>
          {addReportBtn}
        </div>
      </div>
    </div>
  );
}

export default PortraitTestCase;
