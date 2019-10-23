import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { createProject } from "../../../../actions/projectActions";
import { userActivation } from "../../../../actions/userActions";
import { createNewProjectPermission } from "../../../../permissions/ProjectPermissions";

import Input from "../../../../components/common/Input";
import Textarea from "../../../../components/common/Textarea";
import Btn from "../../../../components/common/Btn";
import UnderlineAnchor from "../../../../components/common/UnderlineAnchor";
import ProjectValidation from "../../../../validation/ProjectValidation";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";
import { clearErrors } from "../../../../actions/errorsActions";

import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import SettingPanel from "../../../../components/settings-panel/SettingPanel";
import Header from "../../../../components/common/Header";

class NewProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      submitPressed: false,
      project: this.props.projects.project,
      project_manager: "",
      user: this.props.auth.user,
      title: "",
      url: "",
      image_url: "",
      description: "",
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
      var { isValid } = createNewProjectPermission(nextProps.auth.user.projects, nextProps.auth.user.superadmin);

      if (!isValid) {
        nextProps.history.push(`/ProjectSettings`);
      }
    }
    return Object.keys(update).length ? update : null;
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  checkValidation() {
    var projectData = {};
    projectData.title = this.state.title;
    projectData.description = this.state.description;
    projectData.image_url = this.state.image_url;
    projectData.url = this.state.url;
    projectData.project_manager = this.state.project_manager;

    const { errors } = ProjectValidation(projectData);

    this.setState({ errors });
  }

  submitForm(e) {
    e.preventDefault();
    this.setState({ submitPressed: true });
    this.props.clearErrors();
    this.setState({ errors: {} });
    var projectData = {};
    projectData.title = this.state.title;
    projectData.description = this.state.description;
    projectData.image_url = this.state.image_url;
    projectData.url = this.state.url;
    projectData.project_manager = this.state.project_manager;

    const { errors, isValid } = ProjectValidation(projectData);

    if (isValid) {
      this.props.createProject(projectData, res => {
        if (res.status === 200) {
          successToast("Project created successfully");
          this.props.history.push(`/ProjectSettings`);
        } else {
          failToast("Creating project failed");
          this.props.history.push(`/CreateProject`);
        }
      });
    } else {
      this.setState({ errors });
    }
  }

  submitFormOnEnterKey = e => {
    if (e.keyCode === 13) {
      this.submitForm(e);
    }
  };
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }
  render() {
    var content;
    content = (
      <div>
        <div className="header">
          <div className="header--title">Project Information </div>
          <div className="header--buttons"></div>
        </div>
        <Input
          type="text"
          placeholder="Enter Project Title Here"
          label="Project Title*"
          validationMsg={[this.state.errors.title, this.props.errors.title]}
          value={this.state.title}
          onChange={e => this.onChange(e)}
          name={"title"}
          onKeyDown={this.submitFormOnEnterKey}
        />
        <Textarea
          placeholder="Enter Project Description"
          label="Description"
          validationMsg={this.state.errors.description}
          value={this.state.description}
          onChange={e => this.onChange(e)}
          name={"description"}
          onKeyDown={this.submitFormOnEnterKey}
        />
        <Input
          type="text"
          placeholder="Enter Project URL Here"
          label="Project URL*"
          validationMsg={[this.state.errors.url]}
          value={this.state.url}
          onChange={e => this.onChange(e)}
          name={"url"}
          onKeyDown={this.submitFormOnEnterKey}
        />
        <Input
          type="text"
          placeholder="Enter Managers Here"
          label="Management"
          validationMsg={[]}
          value={this.state.project_manager}
          onChange={e => this.onChange(e)}
          name={"project_manager"}
          onKeyDown={this.submitFormOnEnterKey}
        />
        <Input
          type="text"
          placeholder="Enter Project Image URL Here"
          label="Image URL"
          validationMsg={this.state.errors.image_url}
          value={this.state.image_url}
          onChange={e => this.onChange(e)}
          name={"image_url"}
          onKeyDown={this.submitFormOnEnterKey}
        />

        <div className="flex-column-left mt-4">
          <Btn
            className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
            label="Create Project"
            type="text"
            onClick={e => this.submitForm(e)}
          />
          <UnderlineAnchor link={`/ProjectSettings`} value={"Cancel"} />
        </div>
      </div>
    );

    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <SettingPanel props={this.props} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-arrow-left"></i>}
            title={"Back To Project Settings"}
            history={this.props}
            canGoBack={true}
            link={`/ProjectSettings`}
          />
          <div className="main-content--content">{content}</div>
        </div>
      </div>
    );
  }
}

NewProject.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  roles: state.roles,
  projects: state.projects,
  users: state.users
});

export default connect(
  mapStateToProps,
  { userActivation, createProject, clearErrors }
)(withRouter(NewProject));
