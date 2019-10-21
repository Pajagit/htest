import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getProjects } from "../../actions/projectActions";
import projectImagePlaceholder from "../../img/project-placeholder.jpg";
import Pagination from "../pagination/Pagination";
import ProjectCard from "./ProjectCard";
import Spinner from "../common/Spinner";

class ProjectCardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      user: this.props.auth.user,
      projects: this.props.projects.projects,
      searchTerm: null,
      page: 0,
      dimensions: null,
      errors: {}
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    if (nextProps.auth && nextProps.auth.user) {
      if (nextProps.searchTerm !== prevState.searchTerm && nextProps.searchTerm === "") {
        nextProps.getProjects("", 1);
      }

      if (nextProps.projects && nextProps.projects.projects) {
        update.projects = nextProps.projects.projects;
        if (nextProps.projects.projects.page !== prevState.page) {
          update.page = nextProps.projects.projects.page;
        }
      }
      update.searchTerm = nextProps.searchTerm;
    }
    if (nextProps.projects && nextProps.projects.projects) {
    }
    return Object.keys(update).length ? update : null;
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({
      dimensions: {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight
      }
    });
  }

  render() {
    var loading = true;
    var projectsData;
    var projects = this.props.projects;

    var pageCount = null;
    var showPagination = false;
    if (projects.projects) {
      pageCount = projects.projects.pages;

      if (pageCount > 1) {
        showPagination = true;
      }
    }

    var pagination = "";
    if (this.props.projects.projects && this.props.projects.projects.projects) {
      projects = this.state.projects.projects;
      loading = false;
    }
    if (projects.length > 0 && !loading && this.state.dimensions) {
      if (showPagination) {
        pagination = (
          <Pagination
            pageCount={pageCount}
            page={this.state.page}
            width={this.state.dimensions.width}
            searchTerm={this.state.searchTerm}
          />
        );
      }
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
                  return user.first_name ? user.first_name + " " + user.last_name + ", " : user.email + ", ";
                } else {
                  return user.first_name ? user.first_name + " " + user.last_name : user.email;
                }
              })}
            />
          ))}
        </div>
      );
    } else if (projects.length === 0 && !loading) {
      if (this.state.searchTerm === null || this.state.searchTerm === "") {
        projectsData = (
          <div className="testcase-container-no-content padding">There are no projects assigned to you</div>
        );
      } else {
        projectsData = (
          <div className="testcase-container-no-content padding">There are no projects matching search term</div>
        );
      }
    } else {
      projectsData = <Spinner />;
    }
    return (
      <div>
        <div className="project-card-container-items" ref={el => (this.container = el)}>
          {projectsData}
          {pagination}
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
  projects: state.projects,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getProjects }
)(withRouter(ProjectCardContainer));
