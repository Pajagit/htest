import React from "react";
import AddReportBtn from "./AddReportBtn";
import moment from "moment";

function LandscapeTestCase({ title, tags, author, date, description, id, projectId, onClick }) {
  return (
    <div className="landscape-testcase clickable" onClick={onClick}>
      <div className="landscape-testcase-left">
        <div className="landscape-testcase-left-container">
          <div className="landscape-testcase-left-container--title">{title}</div>

          <div className="landscape-testcase-left-container--tags">{tags}</div>

          <div className="landscape-testcase-left-container--author">
            {author.first_name} {author.last_name} {author.position ? ", " + author.position : ""}
          </div>
          <div className="landscape-testcase-left-container--date">
            {moment(date).format("Do MMMM YYYY, h:mm:ss a")}
          </div>
          <div className="landscape-testcase-left-container--button">
            <AddReportBtn title={"Add to Report"} id={id} />
          </div>
        </div>
      </div>

      <div className="landscape-testcase-right">
        <div className="landscape-testcase-right-container">
          <div className="landscape-testcase-right-container--description">
            <div className="landscape-testcase-right-container--description-title">Description:</div>
            <div className="landscape-testcase-right-container--description-value">{description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandscapeTestCase;
