import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { editProject } from "../../actions/projectActions";
import { getProject } from "../../actions/projectActions";
import { getUsers } from "../../actions/userActions";
import { getRoles } from "../../actions/roleActions";
import { addProject } from "../../actions/userActions";
import { removeProject } from "../../actions/userActions";
import { userActivation } from "../../actions/userActions";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Btn from "../../components/common/Btn";
import UnderlineAnchor from "../../components/common/UnderlineAnchor";
import ProjectValidation from "../../validation/ProjectValidation";
import successToast from "../../toast/successToast";
import failToast from "../../toast/failToast";
import { clearErrors } from "../../actions/errorsActions";
import isEmpty from "../../validation/isEmpty";

import Confirm from "../../components/common/Confirm";
import FullBtn from "../../components/common/FullBtn";
import GlobalPanel from "../../components/global-panel/GlobalPanel";
import SettingPanel from "../../components/settings-panel/SettingPanel";
import Header from "../../components/common/Header";
import Spinner from "../../components/common/Spinner";
import DropdownRemove from "../../components/common/DropdownRemove";
import checkIfElemInObjInArray from "../../utility/checkIfElemInObjInArray";
import removeObjFromArray from "../../utility/removeObjFromArray";
import SearchDropdown from "../../components/common/SearchDropdown";

class EditProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      project: this.props.projects.project,
      roles: [],
      users: [],
      availableUsers: [],
      selectedRole: [],
      image_url: "",
      showAddUser: false,
      errors: {}
    };
    this.selectUserOption = this.selectUserOption.bind(this);
    this.selectedRoleOption = this.selectedRoleOption.bind(this);
    this.showAddUser = this.showAddUser.bind(this);
    this.removeUserBtn = this.removeUserBtn.bind(this);
  }

  componentDidMount() {
    var projectId = this.props.match.params.projectId;
    this.props.getProject(projectId);
    this.props.getUsers();
    this.props.getRoles();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    var { project } = nextProps.projects;
    if (nextProps.projects.project !== prevState.project) {
      if (prevState.initialRender) {
        update.initialRender = false;
        update.projectId = nextProps.match.params.projectId;
        update.title = project.title;
        update.id = project.id;
        update.description = project.description;
        update.deleted = project.deleted;
        update.url = project.url;
        update.image_url = project.image_url ? project.image_url : "";
      }
    }
    var { roles } = nextProps.roles;
    if (nextProps.roles.roles !== prevState.roles) {
      update.roles = roles;
    }
    var { users } = nextProps.users;

    if (nextProps.users && nextProps.users.users) {
      update.users = users;

      var availableUsers = nextProps.users.users;

      if (nextProps.projects.project && nextProps.projects.project.users) {
        project.users.forEach(user => {
          if (checkIfElemInObjInArray(nextProps.users.users, user.id)) {
            availableUsers = removeObjFromArray(availableUsers, user);
          }
        });
        update.availableUsers = availableUsers;
      }
    }

    return Object.keys(update).length ? update : null;
  }

  showAddUser(e) {
    this.setState({ showAddUser: true });
  }

  selectUserOption(value) {
    this.setState({ selectedUser: value });
  }
  selectedRoleOption(value) {
    this.setState({ selectedRole: value });
  }

  submitUser(e) {
    var updateData = {};

    updateData.project_id = parseInt(this.props.match.params.projectId);
    var errors = {};

    if (isEmpty(this.state.selectedUser)) {
      errors.new_user = "User is required";
    } else {
      updateData.user_id = this.state.selectedUser.id;
    }

    if (isEmpty(this.state.selectedRole.id)) {
      errors.new_role = "Role is required";
    } else {
      updateData.role_id = this.state.selectedRole.id;
    }
    if (isEmpty(errors)) {
      this.props.addProject(updateData, res => {
        if (res.status === 200) {
          this.props.getProject(this.props.projects.project.id);
          successToast("Project added successfully");
          this.setState({ selectedUser: [], selectedRole: [], showAddUser: false, errors: {} });
        } else {
        }
      });
    } else {
      this.setState({ errors });
    }
  }

  removeUserBtn(e) {
    this.setState({ showAddUser: false });
    var updateData = {};
    updateData.project_id = parseInt(this.props.match.params.projectId);
    updateData.user_id = e;
    this.props.removeProject(updateData, res => {
      if (res.status === 200) {
        this.props.getProject(this.props.projects.project.id);
        successToast("Project removed successfully");
        this.setState({ errors: {} });
      } else {
      }
    });
  }

  confirmActivation = ([user_id, active]) => {
    var userData = {};
    userData.active = !active;
    this.props.userActivation(user_id, userData, res => {
      if (res.status === 200) {
        if (userData.active && res.data.active) {
          successToast("User activated successfully");
        } else if (!userData.active && !res.data.active) {
          successToast("User deactivated successfully");
        } else {
          failToast("Something went wrong with updating");
        }
      } else {
        failToast("Something went wrong");
      }
      this.props.getUser(this.state.id);
    });
  };
  confirmModal = ([project_id, active]) => {
    var title;
    var msg;
    var reject = "No";
    var confirm;
    if (active) {
      title = "Deactivate this user?";
      msg = "User will not be able to log in or use application";
      confirm = "Deactivate";
    } else {
      title = "Activate this user?";
      msg = "User will be able to log in and use application";
      confirm = "Activate";
    }
    Confirm(title, msg, reject, confirm, e => this.confirmActivation([project_id, active, e]));
  };
  submitForm(e) {
    e.preventDefault();
    this.props.clearErrors();
    this.setState({ errors: {} });
    var projectData = {};
    var projectId = this.state.projectId;
    projectData.title = this.state.title;
    projectData.description = this.state.description;
    projectData.image_url = this.state.image_url;
    projectData.url = this.state.url;

    const { errors, isValid } = ProjectValidation(projectData);
    if (isValid) {
      this.props.editProject(projectId, projectData, res => {
        if (res.status === 200) {
          successToast("Project edited successfully");
          this.props.history.push(`/ProjectSettings`);
        } else {
          failToast("Editing project failed");
          this.props.history.push(`/AddUser`);
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
    this.setState({ [e.target.name]: e.target.value });
  }
  onChangeRole(e, project_id) {
    var updateData = {};
    updateData.project_id = project_id;
    updateData.role_id = parseInt(e.target.value);
    updateData.user_id = parseInt(this.props.match.params.userId);
    this.props.addProject(updateData, res => {
      if (res.status === 200) {
        this.props.getUser(this.props.users.user.id);
        successToast("Project role updated successfully");
        this.setState({ selectedUser: [], selectedRole: [], showAddUser: false });
      } else {
      }
    });
  }
  render() {
    var { project, loading } = this.props.projects;
    var roles = [];
    if (this.props.roles && this.props.roles.roles) {
      roles = this.props.roles.roles;
    }

    var content;
    var usersList = [];
    if (this.state.availableUsers) {
      this.state.availableUsers.map(function(item) {
        return usersList.push({ id: item.id, title: `${item.first_name} ${item.last_name}` });
      });
    }

    var disabledEdit;
    var editUserBtn;
    if (this.state.deleted) {
      disabledEdit = "disabled";
    } else if (!this.state.deleted && !this.state.showAddUser) {
      editUserBtn = (
        <div className="flex-column-left mt-4">
          <Btn
            className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
            label="Edit Project"
            type="text"
            onClick={e => this.submitForm(e)}
          />
          <UnderlineAnchor link={`/ProjectSettings`} value={"Cancel"} />
        </div>
      );
    }
    if (isEmpty(project) || loading) {
      content = <Spinner />;
    } else {
      //   var project;
      var addProject;
      if (isEmpty(project.users)) {
        project = (
          <div>
            <div className="header">Users</div>
            <div className="no-content"> Project has no users assigned to it</div>
          </div>
        );
      } else {
        project = (
          <div>
            <div className="header">Users</div>
            {project.users.map((user, index) => (
              <DropdownRemove
                key={index}
                placeholder="Pick User For Project"
                value={user.id}
                onChange={e => this.onChangeRole(e, user.id)}
                validationMsg={this.state.errors.position}
                name={"role"}
                label={user.first_name + " " + user.last_name}
                onClickRemove={() => this.removeUserBtn(user.id)}
                options={roles}
                role={user.role.id}
              />
            ))}
          </div>
        );
      }

      if (this.state.showAddUser) {
        addProject = (
          <div>
            <div className="bundle-add-new">
              <div className="bundle-add-new--header">
                <div className="bundle-add-new--header-title">Add New User</div>
                <div
                  className="bundle-add-new--header-buttons"
                  onClick={e => this.setState({ showAddUser: false, selectedRole: [], selectedUser: [] })}
                >
                  <i className="fas fa-trash-alt"></i>
                </div>
              </div>
              <div className="bundle-add-new--options">
                <SearchDropdown
                  value={this.state.selectedUser}
                  options={usersList}
                  onChange={this.selectUserOption}
                  placeholder={"Select New User"}
                  label={"Users"}
                  name={"new_user"}
                  validationMsg={this.state.errors.new_user}
                  multiple={false}
                />
                <SearchDropdown
                  value={this.state.selectedRole}
                  options={this.state.roles}
                  onChange={this.selectedRoleOption}
                  label={"Roles"}
                  name={"new_role"}
                  validationMsg={this.state.errors.new_role}
                  placeholder={"Select Role"}
                  multiple={false}
                />
                <Btn
                  className={`btn btn-primary ${this.state.submitBtnDisabledClass}`}
                  label="Add Project"
                  type="text"
                  onClick={e => this.submitUser(e)}
                />
              </div>
            </div>
          </div>
        );
      } else {
        addProject = <FullBtn placeholder="Add New User" onClick={e => this.showAddUser(e)} />;
      }
      var lockBtn;
      var activeStatus;
      if (!project.deleted) {
        lockBtn = (
          <div className="clickable">
            <i className="fas fa-lock-open"></i>
          </div>
        );
        activeStatus = "Active";
      } else {
        lockBtn = (
          <div className="clickable">
            <i className="fas fa-lock"></i>
          </div>
        );
        activeStatus = "Finished";
      }
      content = (
        <div>
          <div className="header">
            <div className="header--title">Project Information </div>
            <div className="header--buttons">
              <div className="header--buttons--primary">({activeStatus})</div>
              <div
                className="header--buttons--secondary"
                // onClick={e => this.confirmModal([project.id, project.active, e])}
              >
                {lockBtn}
              </div>
            </div>
          </div>
          <Input
            type="text"
            placeholder="Enter Project Title Here"
            label="Project Title*"
            validationMsg={[this.state.errors.title]}
            value={this.state.title}
            onChange={e => this.onChange(e)}
            name={"title"}
            onKeyDown={this.submitFormOnEnterKey}
            className={disabledEdit}
          />
          <Textarea
            placeholder="Enter Project Description"
            label="Description*"
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
            className={disabledEdit}
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
            className={disabledEdit}
          />

          {project}
          {addProject}

          {editUserBtn}
        </div>
      );
    }
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

EditProject.propTypes = {
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
  { editProject, getProject, userActivation, addProject, removeProject, getUsers, getRoles, clearErrors }
)(withRouter(EditProject));
