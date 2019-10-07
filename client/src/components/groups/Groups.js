import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getGroups } from "../../actions/groupsActions";
import isEmpty from "../../validation/isEmpty";

import GlobalPanel from "../global-panel/GlobalPanel";
import ProjectPanel from "../project-panel/ProjectPanel";
import BtnAnchor from "../common/BtnAnchor";
import Spinner from "../common/Spinner";
import ListItem from "../lists/ListItem";
import Header from "../common/Header";

class Groups extends Component {
  componentDidMount() {
    var projectId = this.props.match.params.projectId;
    this.props.getGroups(projectId);
  }
  render() {
    var { groups, loading } = this.props.groups;
    var projectId = this.props.match.params.projectId;

    var content;
    if (groups === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(groups)) {
      content = groups.map((group, index) => (
        <ListItem key={index} title={group.title} link={`/${projectId}/EditGroup/${group.id}`} />
      ));
    } else {
      content = <div className="testcase-container-no-content">There are no groups created yet</div>;
    }

    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-project-diagram"></i>}
            title={"Project Groups"}
            history={this.props}
            canGoBack={false}
            addBtn={
              <BtnAnchor
                type={"text"}
                label="Add Group"
                className={"a-btn a-btn-primary"}
                link={`/${projectId}/CreateNewGroup`}
              />
            }
          />
          <div className="list-item-container">{content}</div>
        </div>
      </div>
    );
  }
}

Groups.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  groups: state.groups
});

export default connect(
  mapStateToProps,
  { getGroups }
)(withRouter(Groups));
