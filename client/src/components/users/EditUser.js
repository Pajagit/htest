import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { editUser } from "../../actions/userActions";
import { getUser } from "../../actions/userActions";
import { getProjects } from "../../actions/projectActions";
import { getRoles } from "../../actions/roleActions";
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
// import DropdownRemoveGroup from "../../components/common/DropdownRemoveGroup";
// import DropdownGroup from "../common/DropdownGroup";

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      user: this.props.users.user,
      roles: [],
      projects: [],
      errors: {}
    };
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
        // update.position = user.position ? user.position : "";
        update.active = user.active;
      }
    }
    var { roles } = nextProps.roles;
    if (nextProps.roles.roles !== prevState.roles) {
      update.roles = roles;
    }
    var { projects } = nextProps.projects;
    if (nextProps.projects.projects !== prevState.projects) {
      update.projects = projects;
    }

    return Object.keys(update).length ? update : null;
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
    // var projects = [];
    // if (this.props.projects && this.props.projects.projects) {
    //   projects = this.props.projects.projects;
    // }
    var content;

    var disabledEdit;
    if (this.state.last_login) {
      disabledEdit = "disabled";
    }
    if (isEmpty(user) || loading) {
      content = <Spinner />;
    } else {
      var project;
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
            {/* <DropdownRemoveGroup primary={projects} secondary={roles} validationMsg={this.state.errors.postition} /> */}
            {/* <DropdownGroup
              primary={projects}
              primaryTitle={"Select Project"}
              secondaryTitle={"SelectRole"}
              secondary={roles}
              validationMsg={this.state.errors.postition}
            /> */}
            {user.projects.map((project, index) => (
              <DropdownRemove
                key={index}
                placeholder="Pick Users' Project Role"
                value={project.id}
                onChange={e => this.onChange(e)}
                validationMsg={this.state.errors.position}
                name={"role"}
                label={project.title}
                options={roles}
                role={project.role.id}
              />
            ))}
            <FullBtn placeholder="Add New Project" />
          </div>
        );
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
  { editUser, getUser, userActivation, getProjects, getRoles, clearErrors }
)(withRouter(EditUser));
