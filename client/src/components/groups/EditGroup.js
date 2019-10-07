import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import GroupValidation from "../../validation/GroupValidation";
import isEmpty from "../../validation/isEmpty";
import Spinner from "../common/Spinner";
import { clearErrors } from "../../actions/errorsActions";
import Btn from "../common/Btn";
import Input from "../common/Input";
import Checkbox from "../common/Checkbox";
import GlobalPanel from "../global-panel/GlobalPanel";
import ProjectPanel from "../project-panel/ProjectPanel";
import Header from "../common/Header";
import UnderlineAnchor from "../common/UnderlineAnchor";
import { getGroup } from "../../actions/groupsActions";
import { editGroup } from "../../actions/groupsActions";
import successToast from "../../toast/successToast";
import failToast from "../../toast/failToast";

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

  render() {
    var { group, loading } = this.props.groups;

    var content;
    var projectId = this.props.match.params.projectId;
    if (isEmpty(group) || loading) {
      content = <Spinner />;
    } else {
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
  errors: state.errors
  // auth: state.auth,
});

export default connect(
  mapStateToProps,
  { getGroup, editGroup, clearErrors }
)(withRouter(EditGroup));
