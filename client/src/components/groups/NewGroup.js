import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

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
      isPinned: false,
      errors: {}
    };
  }
  componentDidMount() {
    this.setState({ projectId: this.props.match.params.projectId });
  }
  togglePinned() {
    this.setState({ isPinned: !this.state.isPinned });
  }
  submitForm(e) {
    var groupData = {};
    groupData.title = this.state.title;
    groupData.pinned = this.state.isPinned;
    groupData.project_id = this.state.projectId;
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
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      // if (this.state.submitPressed) {
      //   this.checkValidation();
      // }
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
          validationMsg={this.state.errors.title}
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
  groups: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases,
  groups: state.groups
  // auth: state.auth,
});

export default connect(
  mapStateToProps,
  { createGroup }
)(withRouter(NewGroup));
