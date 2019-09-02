import React from "react";
import AddReportBtn from "../common/AddReportBtn";
import { Link } from "react-router-dom";

function PortraitTestCase({ title, tags, author, date, description }) {
  return (
      <div className="portrait-testcase">
        <div className="portrait-testcase-top">
        <Link to="test">
          <div className="portrait-testcase-top--title">{title}</div>
          </Link>
          <div className="portrait-testcase-top--tags">{tags}</div>

          <div className="portrait-testcase-top--author">{author}</div>
          <div className="portrait-testcase-top--date">{date}</div>
        </div>
        <div className="portrait-testcase-bottom">
          <div className="portrait-testcase-bottom--description">{description}</div>
          <div className="portrait-testcase-bottom--button">
            <AddReportBtn title={"Add to Report"} />
          </div>
        </div>
      </div>
   
  );
}

export default PortraitTestCase;
