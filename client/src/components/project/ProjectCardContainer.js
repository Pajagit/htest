import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getProjects } from "../../actions/projectActions";
import projectImagePlaceholder from "../../img/project-placeholder.jpg";
import ProjectCard from "./ProjectCard";
import Spinner from "../common/Spinner";

class ProjectCardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      user: this.props.auth.user,
      projects: this.props.projects.projects,
      errors: {}
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    var { user } = nextProps.auth;
    if (nextProps.auth && nextProps.auth.user) {
      if (nextProps.auth.user !== prevState.user) {
        nextProps.getProjects();
        update.user = user;
      }

      if (nextProps.projects && nextProps.projects.projects) {
        update.projects = nextProps.projects.projects;
      }
    }

    return Object.keys(update).length ? update : null;
  }
  componentDidMount() {
    this.props.getProjects();
  }
  render() {
    var projects = [];
    var loading = true;
    var projectsData;
    if (this.props.projects && this.props.projects.projects) {
      projects = this.state.projects;
      loading = false;
    }
    if (projects.length > 0 && !loading) {
      projectsData = (
        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              img={project.image_url ? project.image_url : projectImagePlaceholder}
              title={project.title}
              id={project.id}
              management={project.project_manager}
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
      );
    } else if (projects.length === 0 && !loading) {
      projectsData = (
        <div className="testcase-grid">
          <div className="testcase-container-no-content">There are no projects assigned to you</div>
        </div>
      );
    } else {
      projectsData = <Spinner />;
    }
    return (
      <div>
        <div className="project-card-container-items">{projectsData}</div>
      </div>
    );
  }
}

ProjectCardContainer.propTypes = {
  projects: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases,
  projects: state.projects,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getProjects }
)(withRouter(ProjectCardContainer));
