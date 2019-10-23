import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { addUser } from "../../../../actions/userActions";
import { globalAddUserPermission } from "../../../../permissions/UserPermissions";
import Input from "../../../../components/common/Input";
import Btn from "../../../../components/common/Btn";
import UnderlineAnchor from "../../../../components/common/UnderlineAnchor";
import UserValidation from "../../../../validation/UserValidation";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";
import { clearErrors } from "../../../../actions/errorsActions";

import Switch from "../../../../components/common/Switch";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import SettingPanel from "../../../../components/settings-panel/SettingPanel";
import Header from "../../../../components/common/Header";

class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      submitPressed: false,
      email: "",
      isSuperAdmin: false,
      first_name: "",
      last_name: "",
      errors: {}
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};

    if (nextProps.auth && nextProps.auth.user) {
      var { isValid } = globalAddUserPermission(nextProps.auth.user.projects, nextProps.auth.user.superadmin);
    }

    if (!isValid) {
      nextProps.history.push(`/UserSettings`);
    }

    return Object.keys(update).length ? update : null;
  }

  checkValidation() {
    var userData = {};
    userData.email = this.state.email;
    userData.first_name = this.state.first_name;
    userData.last_name = this.state.last_name;

    const { errors } = UserValidation(userData);

    this.setState({ errors });
  }

  submitForm(e) {
    e.preventDefault();
    this.setState({ submitPressed: true });
    this.props.clearErrors();
    this.setState({ errors: {} });
    var userData = {};
    userData.email = this.state.email;
    userData.first_name = this.state.first_name;
    userData.last_name = this.state.last_name;
    userData.superadmin = this.state.isSuperAdmin;
    const { errors, isValid } = UserValidation(userData);
    if (isValid) {
      this.props.addUser(userData, res => {
        if (res.status === 200) {
          successToast("User added successfully");
          this.props.history.push(`/UserSettings`);
        } else {
          failToast("Adding user failed");
          this.props.history.push(`/AddUser`);
        }
      });
    } else {
      this.setState({ errors });
    }
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }
  render() {
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
          <div className="main-content--content">
            <div className="header">
              <div className="header--title">User Information </div>
              <div className="header--buttons">
                <div className="header--buttons--primary">Super Admin</div>
                <div className="header--buttons--secondary">
                  <Switch
                    label={""}
                    value={this.state.isSuperAdmin}
                    onClick={e => this.setState({ isSuperAdmin: !this.state.isSuperAdmin })}
                    name={"isSuperAdmin"}
                  />
                </div>
              </div>
            </div>
            <div>
              <Input
                type="text"
                placeholder="Enter Users' email here"
                label="Email*"
                validationMsg={[this.state.errors.email, this.props.errors.error]}
                value={this.state.email}
                onChange={e => this.onChange(e)}
                name={"email"}
                onKeyDown={this.submitFormOnEnterKey}
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
              />
              <div className="flex-column-left mt-4">
                <Btn
                  className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
                  label="Add User"
                  type="text"
                  onClick={e => this.submitForm(e)}
                />

                <UnderlineAnchor link={`/UserSettings`} value={"Cancel"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddUser.propTypes = {
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
  { addUser, clearErrors }
)(withRouter(AddUser));
