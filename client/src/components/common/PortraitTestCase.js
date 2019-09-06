import React from "react";
import AddReportBtn from "../common/AddReportBtn";
import { Link } from "react-router-dom";

function PortraitTestCase({ title, tags, author, date, description, id }) {
  return (
    <div className="portrait-testcase">
      <div className="portrait-testcase-top">
        <div className="portrait-testcase-top-container">
          <Link to={`/TestCase/${id}`}>
            <div className="portrait-testcase-top-container--title">{title}</div>
          </Link>
          <div className="portrait-testcase-top-container--tags">{tags}</div>

          <div className="portrait-testcase-top-container--author">{author}</div>
          <div className="portrait-testcase-top-container--date">{date}</div>
        </div>
      </div>
      <div className="portrait-testcase-bottom">
        <div className="portrait-testcase-bottom-container">
          <div className="portrait-testcase-bottom-container--description">{description}</div>
          <div className="portrait-testcase-bottom-container--button">
            <AddReportBtn title={"Add to Report"} id={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortraitTestCase;
