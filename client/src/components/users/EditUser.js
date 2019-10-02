import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { editUser } from "../../actions/userActions";
import { getUser } from "../../actions/userActions";
import { getProjects } from "../../actions/projectActions";
import { getRoles } from "../../actions/roleActions";
import { addProject } from "../../actions/userActions";
import { removeProject } from "../../actions/userActions";
import { userActivation } from "../../actions/userActions";
import Input from "../../components/common/Input";
import Btn from "../../components/common/Btn";
import UnderlineAnchor from "../../components/common/UnderlineAnchor";
import UserValidation from "../../validation/UserValidation";
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
// import DropdownRemoveGroup from "../../components/common/DropdownRemoveGroup";
// import DropdownGroup from "../common/DropdownGroup";
import SearchDropdown from "../../components/common/SearchDropdown";

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      user: this.props.users.user,
      roles: [],
      projects: [],
      avaliableProjects: [],
      selectedRole: [],
      showAddProject: false,
      errors: {}
    };
    this.selectProjectOption = this.selectProjectOption.bind(this);
    this.selectedRoleOption = this.selectedRoleOption.bind(this);
    this.showAddProject = this.showAddProject.bind(this);
    this.removeProjectBtn = this.removeProjectBtn.bind(this);
  }

  componentDidMount() {
    var userId = this.props.match.params.userId;
    this.props.getUser(userId);
    this.props.getProjects();
    this.props.getRoles();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    var { user } = nextProps.users;
    if (nextProps.users.user !== prevState.user) {
      if (prevState.initialRender) {
        update.initialRender = false;
        update.userId = nextProps.match.params.userId;
        update.email = user.email;
        update.id = user.id;
        update.first_name = user.first_name ? user.first_name : "";
        update.last_name = user.last_name ? user.last_name : "";
        update.last_login = user.last_login ? user.last_login : null;
        update.active = user.active;
      }
    }
    var { roles } = nextProps.roles;
    if (nextProps.roles.roles !== prevState.roles) {
      update.roles = roles;
    }
    var { projects } = nextProps.projects;
    if (nextProps.projects && nextProps.projects.projects) {
      update.projects = projects;

      var avaliableProjects = nextProps.projects.projects;

      if (nextProps.users.user && nextProps.users.user.projects) {
        user.projects.forEach(project => {
          if (checkIfElemInObjInArray(nextProps.projects.projects, project.id)) {
            avaliableProjects = removeObjFromArray(avaliableProjects, project);
          }
        });
        update.avaliableProjects = avaliableProjects;
        console.log(avaliableProjects);
      }
    }

    return Object.keys(update).length ? update : null;
  }

  showAddProject(e) {
    this.setState({ showAddProject: true });
  }

  selectProjectOption(value) {
    this.setState({ selectedProject: value });
  }
  selectedRoleOption(value) {
    this.setState({ selectedRole: value });
  }

  submitProject(e) {
    var updateData = {};
    updateData.project_id = this.state.selectedProject.id;
    updateData.role_id = this.state.selectedRole.id;
    updateData.user_id = parseInt(this.props.match.params.userId);
    this.props.addProject(updateData, res => {
      if (res.status === 200) {
        this.props.getUser(this.props.users.user.id);
        successToast("Project added successfully");
        this.setState({ selectedProject: [], selectedRole: [] });
      } else {
      }
    });
  }

  removeProjectBtn(e) {
    var updateData = {};
    updateData.user_id = parseInt(this.props.match.params.userId);
    updateData.project_id = e;
    console.log(updateData);
    this.props.removeProject(updateData, res => {
      if (res.status === 200) {
        this.props.getUser(this.props.users.user.id);
        successToast("Project removed successfully");
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
  confirmModal = ([user_id, active]) => {
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
    Confirm(title, msg, reject, confirm, e => this.confirmActivation([user_id, active, e]));
  };
  submitForm(e) {
    e.preventDefault();
    this.props.clearErrors();
    this.setState({ errors: {} });
    var userData = {};
    var userId = this.state.userId;
    userData.email = this.state.email;
    userData.first_name = this.state.first_name;
    userData.last_name = this.state.last_name;

    const { errors, isValid } = UserValidation(userData);
    if (isValid) {
      this.props.editUser(userId, userData, res => {
        if (res.status === 200) {
          successToast("User edited successfully");
          this.props.history.push(`/UserSettings`);
        } else {
          failToast("Editing user failed");
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
  render() {
    var { user, loading } = this.props.users;
    var roles = [];
    if (this.props.roles && this.props.roles.roles) {
      roles = this.props.roles.roles;
    }

    var content;

    var disabledEdit;
    if (this.state.last_login) {
      disabledEdit = "disabled";
    }
    if (isEmpty(user) || loading) {
      content = <Spinner />;
    } else {
      var project;
      var addProject;
      if (isEmpty(user.projects)) {
        project = (
          <div>
            <div className="header">Projects</div>
            <div className="no-content"> User is not assigned to any project yet</div>
            <FullBtn placeholder="Add project" />
          </div>
        );
      } else {
        project = (
          <div>
            <div className="header">Projects</div>
            {user.projects.map((project, index) => (
              <DropdownRemove
                key={index}
                placeholder="Pick Users' Project Role"
                value={project.id}
                onChange={e => this.onChange(e)}
                validationMsg={this.state.errors.position}
                name={"role"}
                label={project.title}
                onClickRemove={() => this.removeProjectBtn(project.id)}
                options={roles}
                role={project.role.id}
              />
            ))}
          </div>
        );
        if (this.state.showAddProject) {
          addProject = (
            <div>
              <div className="bundle-add-new">
                <div className="bundle-add-new--header">
                  <div className="bundle-add-new--header-title">Add New Project</div>
                  <div
                    className="bundle-add-new--header-buttons"
                    onClick={e => this.setState({ showAddProject: false, selectedRole: [], selectedProject: [] })}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </div>
                </div>
                <div className="bundle-add-new--options">
                  <SearchDropdown
                    value={this.state.selectedProject}
                    options={this.state.avaliableProjects}
                    onChange={this.selectProjectOption}
                    placeholder={"Select New Project"}
                    label={"Projects"}
                    multiple={false}
                  />
                  <SearchDropdown
                    value={this.state.selectedRole}
                    options={this.state.roles}
                    onChange={this.selectedRoleOption}
                    label={"Roles"}
                    placeholder={"Select Role"}
                    multiple={false}
                  />
                  <Btn
                    className={`btn btn-primary ${this.state.submitBtnDisabledClass}`}
                    label="Add Project"
                    type="text"
                    onClick={e => this.submitProject(e)}
                  />
                </div>
              </div>
            </div>
          );
        } else {
          addProject = <FullBtn placeholder="Add New Project" onClick={e => this.showAddProject(e)} />;
        }
      }
      var lockBtn;
      var activeStatus;
      if (user.active) {
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
        activeStatus = "Deactivated";
      }
      content = (
        <div>
          <div className="header">
            <div className="header--title">User Information </div>
            <div className="header--buttons">
              <div className="header--buttons--primary">({activeStatus})</div>
              <div className="header--buttons--secondary" onClick={e => this.confirmModal([user.id, user.active, e])}>
                {" "}
                {lockBtn}
              </div>
            </div>
          </div>
          <Input
            type="text"
            placeholder="Enter Users' email here"
            label="Email*"
            validationMsg={[this.state.errors.email, this.props.errors.error]}
            value={this.state.email}
            onChange={e => this.onChange(e)}
            name={"email"}
            onKeyDown={this.submitFormOnEnterKey}
            className={disabledEdit}
          />
          <Input
            type="text"
            placeholder="Enter Users' First Name Here"
            label="First Name"
            validationMsg={this.state.errors.first_name}
            value={this.state.first_name}
            onChange={e => this.onChange(e)}
            name={"first_name"}
            onKeyDown={this.submitFormOnEnterKey}
            className={disabledEdit}
          />
          <Input
            type="text"
            placeholder="Enter Users' Last Name Here"
            label="Last Name"
            validationMsg={this.state.errors.last_name}
            value={this.state.last_name}
            onChange={e => this.onChange(e)}
            name={"last_name"}
            onKeyDown={this.submitFormOnEnterKey}
            className={disabledEdit}
          />
          {/* <Dropdown
            placeholder="Pick Users' Position Here"
            value={this.state.position}
            onChange={e => this.onChange(e)}
            validationMsg={this.state.errors.position}
            name={"position"}
            label="Position"
            options={positionOptions}
          /> */}
          {project}
          {addProject}
          <div className="flex-column-left mt-4">
            <Btn
              className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
              label="Edit User"
              type="text"
              onClick={e => this.submitForm(e)}
            />

            <UnderlineAnchor link={`/UserSettings`} value={"Cancel"} />
          </div>
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
            title={"Back To User Settings"}
            history={this.props}
            canGoBack={true}
            link={`/UserSettings`}
          />
          <div className="main-content--content">{content}</div>
        </div>
      </div>
    );
  }
}

EditUser.propTypes = {
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
  { editUser, getUser, userActivation, addProject, removeProject, getProjects, getRoles, clearErrors }
)(withRouter(EditUser));
