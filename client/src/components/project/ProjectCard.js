import React from "react";
import { Link } from "react-router-dom";

function Project({ img, title, management, qa }) {
  return (
    <div className="project-card-container-items-item">
      <div className="project">
        <Link to={"/1/TestCases"}>
          <div className="project--image">
            <img src={img} alt="Project" />
          </div>
          <div className="project--bottom">
            <div className="project--bottom--title"> {title}</div>
            <div className="project--bottom--management truncate">{management}</div>
            <div className="project--bottom--qa truncate">{qa}</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
export default Project;
