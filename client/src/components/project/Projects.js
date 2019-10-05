import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { clearProject } from "../../actions/projectActions";
import GlobalPanel from "../../components/global-panel/GlobalPanel";
import Header from "../../components/common/Header";
import ProjectContainer from "../../components/project/ProjectCardContainer";

class Projects extends Component {
  componentWillUnmount() {
    this.props.clearProject();
  }
  render() {
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <div className="main-content full-content-grid">
          <Header icon={<i className="fas fa-th"></i>} title={"Projects"} history={this.props} canGoBack={false} />

          <ProjectContainer />
        </div>
      </div>
    );
  }
}

Projects.propTypes = {
  projects: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projects: state.projects
  // auth: state.auth,
});

export default connect(
  mapStateToProps,
  { clearProject }
)(withRouter(Projects));
