import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { groupsPermission } from "../../../../permissions/GroupPermissions";
import { getGroups } from "../../../../actions/groupsActions";
import isEmpty from "../../../../validation/isEmpty";

import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import BtnAnchor from "../../../../components/common/BtnAnchor";
import Spinner from "../../../../components/common/Spinner";
import ListItem from "../../../../components/lists/ListItem";
import Header from "../../../../components/common/Header";

class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      projectId: null,
      user: this.props.auth.user,
      errors: {}
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    var { user } = nextProps.auth;
    if (nextProps.auth && nextProps.auth.user) {
      if (nextProps.auth.user !== prevState.user) {
        update.user = user;
      }
      var { isValid } = groupsPermission(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );

      if (!isValid) {
        nextProps.history.push(`/${nextProps.match.params.projectId}/TestCases`);
      }
    }
    return Object.keys(update).length ? update : null;
  }
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
            icon={<i className="fas fa-object-group"></i>}
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
