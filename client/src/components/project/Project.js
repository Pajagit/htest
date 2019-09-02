import React from "react";
import { Link } from "react-router-dom";

function Project({ img, title, management, url }) {
  return (
    <Link to={"/1/TestCases"}>
      <div className="project">
        <div className="project--image">
          <img src={img} alt="Project" />
        </div>
        <div className="project--bottom">
          <div className="project--bottom--title"> {title}</div>
          <div className="project--bottom--management">{management}</div>
          <div className="project--bottom--url">{url}</div>
        </div>
      </div>
    </Link>
  );
}
export default Project;
