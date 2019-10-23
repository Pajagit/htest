import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getProjects } from "../../../actions/projectActions";

import { clearProject } from "../../../actions/projectActions";
import GlobalPanel from "../../../components/global-panel/GlobalPanel";
import Header from "../../../components/common/Header";
import SearchBtn from "../../../components/common/SearchBtn";
import ProjectContainer from "../../../components/project/ProjectCardContainer";

const WAIT_INTERVAL = 500;
const ENTER_KEY = 13;
class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ""
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillUnmount() {
    this.props.clearProject();
  }

  timer = null;
  handleChange = e => {
    clearTimeout(this.timer);
    this.setState({ searchTerm: e.target.value });
    this.timer = setTimeout(() => {
      this.triggerChange();
    }, WAIT_INTERVAL);
  };

  handleKeyDown = e => {
    if (e.keyCode === ENTER_KEY) {
      clearTimeout(this.timer);
      this.triggerChange(e);
    }
  };

  triggerChange = e => {
    this.props.getProjects(this.state.searchTerm, 1);
  };

  render() {
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <div className="main-content full-content-grid">
          <Header
            icon={<i className="fas fa-th"></i>}
            title={"Projects"}
            searchBtn={
              <SearchBtn
                name={"search"}
                searchActive={this.state.searchTerm}
                value={this.state.searchTerm}
                onChange={e => this.handleChange(e)}
                onKeyDown={this.handleKeyDown}
              />
            }
            history={this.props}
            canGoBack={false}
          />

          <ProjectContainer searchTerm={this.state.searchTerm} />
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
  { clearProject, getProjects }
)(withRouter(Projects));
