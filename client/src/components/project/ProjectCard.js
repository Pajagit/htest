import React from "react";
import isEmpty from "../../validation/isEmpty";
import { Link } from "react-router-dom";

function ProjectCard({ img, title, management, qa, id }) {
  if (isEmpty(qa)) {
    qa = "Not specified";
  }
  if (isEmpty(management)) {
    management = "Not specified";
  }
  return (
    <div className="portrait-project">
      <Link to={`/${id}/TestCases`}>
        <div className="portrait-project-top">
          <div className="portrait-project-top-image">
            <img src={img} alt="" />
          </div>
        </div>

        <div className="portrait-project-bottom">
          <div className="portrait-project-bottom-container">
            <div className="portrait-project-bottom-container--title">{title}</div>
            <div className="portrait-project-bottom-container--management">Management: {management}</div>
            <div className="portrait-project-bottom-container--qa">QA: {qa}</div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProjectCard;
