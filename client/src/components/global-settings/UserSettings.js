import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getUsers } from "../../actions/userActions";
import { globalUsersPermissions } from "../../permissions/UserPermissions";
import isEmpty from "../../validation/isEmpty";
import { userActivation } from "../../actions/userActions";
import successToast from "../../toast/successToast";
import failToast from "../../toast/failToast";

import GlobalPanel from "../global-panel/GlobalPanel";
import Confirm from "../common/Confirm";
import SettingPanel from "../settings-panel/SettingPanel";
import BtnAnchor from "../common/BtnAnchor";
import Spinner from "../common/Spinner";
import ListItem from "../lists/ListItem";
import Header from "../common/Header";
import placeholderImg from "../../img/user-placeholder.png";

class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
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
      var { isValid } = globalUsersPermissions(nextProps.auth.user.projects, nextProps.auth.user.superadmin);

      if (!isValid) {
        nextProps.history.push(`/Projects`);
      }
    }
    return Object.keys(update).length ? update : null;
  }

  componentDidMount() {
    this.props.getUsers();
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
      this.props.getUsers();
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

  render() {
    var { users, loading } = this.props.users;
    var content;
    if (users === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(users)) {
      content =
        users &&
        users.map((user, index) => (
          <ListItem
            key={index}
            loggedIn={false}
            // activationOnClick={e => this.confirmModal([user.id, user.active, e])}
            title={[user.first_name ? user.first_name : user.email, " ", user.last_name ? user.last_name : ""]}
            // isActive={user.active}
            link={`/EditUser/${user.id}`}
            img={user.image_url ? user.image_url : placeholderImg}
            list={user.projects.map((project, projectIndex) => (
              <React.Fragment key={projectIndex}>
                {project.title} {user.projects.length - 1 > projectIndex ? `, ` : ``}
              </React.Fragment>
            ))}
          />
        ));
    } else {
      content = <div className="testcase-container-no-content">There are no users created yet</div>;
    }

    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <SettingPanel props={this.props} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-user-cog"></i>}
            title={"User Settings"}
            history={this.props}
            canGoBack={false}
            addBtn={<BtnAnchor type={"text"} label="Add User" className={"a-btn a-btn-primary"} link={`AddUser`} />}
          />
          <div className="list-item-container">{content}</div>
        </div>
      </div>
    );
  }
}

UserSettings.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  users: state.users
});

export default connect(
  mapStateToProps,
  { getUsers, userActivation }
)(withRouter(UserSettings));
