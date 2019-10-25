import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getGroups } from "../../../actions/groupsActions";
import GlobalPanel from "../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../components/project-panel/ProjectPanel";
// import BtnAnchor from "../common/BtnAnchor";
import Header from "../../../components/common/Header";

class ProjectInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      projectId: null,
      errors: {}
    };
  }
  componentDidMount() {
    this.setState({ projectId: this.props.match.params.projectId });
  }
  render() {
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-project-diagram"></i>}
            title={"Project Info"}
            history={this.props}
            canGoBack={false}
            // addBtn={
            //   <BtnAnchor
            //     type={"text"}
            //     label="Add Project"
            //     className={"a-btn a-btn-primary"}
            //     link={`/${this.state.projectId}/CreateNewGroup`}
            //   />
            // }
          />
          <div className="list-item-container">
            <div className="header">
              <div className="header--title">Project Information </div>
              <div className="header--buttons">
                <div className="header--buttons--primary"></div>
                <div
                  className="header--buttons--secondary clickable"
                  //    onClick={e => this.confirmModal([])}
                >
                  {/* <i className="fas fa-trash-alt"></i> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProjectInfo.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getGroups }
)(withRouter(ProjectInfo));