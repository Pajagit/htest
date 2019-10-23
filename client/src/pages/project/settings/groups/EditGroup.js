import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import GroupValidation from "../../../../validation/GroupValidation";
import isEmpty from "../../../../validation/isEmpty";
import Spinner from "../../../../components/common/Spinner";
import { clearErrors } from "../../../../actions/errorsActions";
import Confirm from "../../../../components/common/Confirm";
import { createNewGroupPermission } from "../../../../permissions/GroupPermissions";

import Btn from "../../../../components/common/Btn";
import Input from "../../../../components/common/Input";
import Checkbox from "../../../../components/common/Checkbox";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import Header from "../../../../components/common/Header";
import UnderlineAnchor from "../../../../components/common/UnderlineAnchor";
import { getGroup } from "../../../../actions/groupsActions";
import { editGroup } from "../../../../actions/groupsActions";
import { removeGroup } from "../../../../actions/groupsActions";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";

class EditGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      projectId: null,
      groupId: null,
      group: this.props.groups.group,
      title: "",
      id: null,
      isPinned: false,
      errors: {}
    };
  }
  componentDidMount() {
    this.setState({ projectId: this.props.match.params.projectId, groupId: this.props.match.params.groupId });
    var groupId = this.props.match.params.groupId;
    this.props.getGroup(groupId);
  }
  componentWillUnmount() {
    this.props.clearErrors();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    var { group } = nextProps.groups;
    if (nextProps.groups && nextProps.groups.group) {
      if (nextProps.groups.group !== prevState.group) {
        if (prevState.initialRender) {
          update.initialRender = false;
          update.title = group.title;
          update.id = group.id;
          update.isPinned = group.isPinned;
        }
      }
    }

    var { user } = nextProps.auth;

    if (nextProps.auth && nextProps.auth.user) {
      if (nextProps.auth.user !== prevState.user) {
        update.user = user;
      }
      var { isValid } = createNewGroupPermission(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );

      if (!isValid) {
        nextProps.history.push(`/${nextProps.match.params.projectId}/Groups`);
      }
    }

    return Object.keys(update).length ? update : null;
  }

  togglePinned() {
    this.setState({ isPinned: !this.state.isPinned });
  }

  checkValidation() {
    var formData = {};

    formData.title = this.state.title;

    const { errors } = GroupValidation(formData);

    this.setState({ errors });
  }

  submitForm(e) {
    this.props.clearErrors();
    var groupData = {};
    groupData.title = this.state.title;
    groupData.pinned = this.state.isPinned;
    const { errors, isValid } = GroupValidation(groupData);

    if (isValid) {
      this.props.editGroup(this.state.groupId, groupData, res => {
        if (res.status === 200) {
          this.props.history.push(`/${this.state.projectId}/Groups`);

          successToast("Group successfully edited");
        } else {
          failToast("Group editing failed");
        }
      });
    } else {
      this.setState({ errors });
    }
  }

  onChange(e) {
    this.props.clearErrors();
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.checkValidation();
    });
  }

  confirmActivation = e => {
    this.props.removeGroup(this.state.groupId, res => {
      if (res.status === 200) {
        successToast("Group removed successfully");
        this.props.history.push(`/${this.state.projectId}/Groups`);
      } else {
        failToast("Something went wrong with removing group");
      }
    });
  };
  confirmModal = () => {
    var reject = "No";
    var title = "Remove this group?";
    var msg = "This is only possible if there are no Test Cases assigned to this group";
    var confirm = "Remove";

    Confirm(title, msg, reject, confirm, e => this.confirmActivation());
  };

  render() {
    var { group, loading } = this.props.groups;

    var content;
    var projectId = this.props.match.params.projectId;
    if (isEmpty(group) || loading) {
      content = <Spinner />;
    } else {
      content = (
        <div className="main-content--content">
          <div className="header">
            <div className="header--title">Group Information </div>
            <div className="header--buttons">
              <div className="header--buttons--primary"></div>
              <div className="header--buttons--secondary clickable" onClick={e => this.confirmModal([])}>
                <i className="fas fa-trash-alt"></i>
              </div>
            </div>
          </div>
          <Input
            type="text"
            placeholder="Enter Group Name"
            label="Group name*"
            validationMsg={[this.state.errors.title, this.props.errors.title, this.props.errors.error]}
            value={this.state.title}
            onChange={e => this.onChange(e)}
            name={"title"}
            onKeyDown={this.submitFormOnEnterKey}
          />
          <div className="flex-column-left mt-4">
            <Btn
              className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
              label="Save Group"
              type="text"
              onClick={e => this.submitForm(e)}
            />

            <UnderlineAnchor link={`/${projectId}/Groups`} value={"Cancel"} />
          </div>
          <Checkbox
            label="Set group as pinned"
            onClick={e => this.togglePinned(e)}
            name="isPinned"
            value={this.state.isPinned}
          />
        </div>
      );
    }
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-arrow-left"></i>}
            title={"Back to All Groups"}
            history={this.props}
            link={`/${projectId}/Groups`}
            canGoBack={true}
          />
          {content}
        </div>
      </div>
    );
  }
}

EditGroup.propTypes = {
  testcases: PropTypes.object.isRequired,
  groups: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases,
  groups: state.groups,
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getGroup, editGroup, removeGroup, clearErrors }
)(withRouter(EditGroup));
