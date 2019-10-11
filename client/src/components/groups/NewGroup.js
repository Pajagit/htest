import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import GroupValidation from "../../validation/GroupValidation";
import { createNewGroupPermission } from "../../permissions/GroupPermissions";
import { clearErrors } from "../../actions/errorsActions";
import Btn from "../common/Btn";
import Input from "../common/Input";
import Checkbox from "../common/Checkbox";
import GlobalPanel from "../global-panel/GlobalPanel";
import ProjectPanel from "../project-panel/ProjectPanel";
import Header from "../common/Header";
import UnderlineAnchor from "../common/UnderlineAnchor";
import { createGroup } from "../../actions/groupsActions";
import successToast from "../../toast/successToast";
import failToast from "../../toast/failToast";

class NewGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      projectId: null,
      title: "",
      user: this.props.auth.user,
      isPinned: false,
      submitPressed: false,
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

  componentDidMount() {
    this.setState({ projectId: this.props.match.params.projectId });
  }
  componentWillUnmount() {
    this.props.clearErrors();
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
    this.setState({ submitPressed: true });
    this.props.clearErrors();
    var groupData = {};
    groupData.title = this.state.title;
    groupData.pinned = this.state.isPinned;
    groupData.project_id = this.state.projectId;
    const { errors, isValid } = GroupValidation(groupData);

    if (isValid) {
      this.props.createGroup(groupData, res => {
        if (res.status === 200) {
          this.props.history.push(`/${this.state.projectId}/Groups`);
          if (groupData.pinned) {
            successToast("Group successfully created and pinned");
          } else {
            successToast("Group successfully created");
          }
        } else {
          failToast("Group creating failed");
        }
      });
    } else {
      this.setState({ errors });
    }
  }

  onChange(e) {
    this.props.clearErrors();
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }

  render() {
    var content;
    var projectId = this.props.match.params.projectId;
    content = (
      <div className="main-content--content">
        <Input
          type="text"
          placeholder="Enter Group Name"
          label="Group name*"
          validationMsg={[this.state.errors.title, this.props.errors.title]}
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

NewGroup.propTypes = {
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
  { createGroup, clearErrors }
)(withRouter(NewGroup));
