import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getProjects } from "../../actions/projectActions";
import ProjectCard from "./ProjectCard";

class ProjectCardContainer extends Component {
  componentDidMount() {
    this.props.getProjects();
  }

  render() {
    var projects = [];
    if (this.props.projects && this.props.projects.projects) {
      projects = this.props.projects.projects;
    }
    return (
      <div>
        <div className="project-card-container-items">
          <div className="testcase-grid">
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                img={project.image_url}
                title={project.title}
                id={project.id}
                management={project.management}
                qa={project.users.map((user, index) => {
                  if (project.users.length > index + 1) {
                    return user.first_name + " " + user.last_name + ", ";
                  } else {
                    return user.first_name + " " + user.last_name;
                  }
                })}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

ProjectCardContainer.propTypes = {
  projects: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases,
  projects: state.projects
  // auth: state.auth,
});

export default connect(
  mapStateToProps,
  { getProjects }
)(withRouter(ProjectCardContainer));
