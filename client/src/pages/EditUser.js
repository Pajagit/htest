import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { editUser } from "../actions/userActions";
import { getUser } from "../actions/userActions";
import Input from "../components/common/Input";
import Btn from "../components/common/Btn";
import UnderlineAnchor from "../components/common/UnderlineAnchor";
import UserValidation from "../validation/UserValidation";
import successToast from "../toast/successToast";
import failToast from "../toast/failToast";
import { clearErrors } from "../actions/errorsActions";
import isEmpty from "../validation/isEmpty";

import GlobalPanel from "../components/global-panel/GlobalPanel";
import SettingPanel from "../components/settings-panel/SettingPanel";
import Header from "../components/common/Header";
import Spinner from "../components/common/Spinner";

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      user: this.props.users.user,
      errors: {}
    };
  }

  componentDidMount() {
    var userId = this.props.match.params.userId;
    this.props.getUser(userId);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    if (nextProps.users && nextProps.users.user) {
      if (nextProps.users !== prevState.users) {
        var { user } = nextProps.users;
        if (nextProps.users.user !== prevState.user) {
          if (prevState.initialRender) {
            update.initialRender = false;
            update.userId = nextProps.match.params.userId;
            update.email = user.email;
            update.first_name = user.first_name ? user.first_name : "";
            update.last_name = user.last_name ? user.last_name : "";
          }
          return Object.keys(update).length ? update : null;
        }
      }
    }
    return null;
  }

  submitForm(e) {
    e.preventDefault();
    this.props.clearErrors();
    this.setState({ errors: {} });
    var userData = {};
    userData.email = this.state.email;
    userData.first_name = this.state.first_name;
    userData.last_name = this.state.last_name;

    const { errors, isValid } = UserValidation(userData);
    if (isValid) {
      this.props.editUser(userData, res => {
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
      console.log(this.state);
    });
  }
  render() {
    var { user, loading } = this.props.users;
    var content;
    if (isEmpty(user) || loading) {
      content = <Spinner />;
    } else {
      content = (
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
  users: state.users
});

export default connect(
  mapStateToProps,
  { editUser, getUser, clearErrors }
)(withRouter(EditUser));
