import React, { Component } from "react";
import htestLogo from "../img/htest-logo.png";
import { clearErrors } from "../actions/errorsActions";
import { GoogleLogin } from "react-google-login";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { withRouter } from "react-router-dom";
import { loginUser } from "../actions/authActions";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      mounted: false,
      errors: {}
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    if (nextProps.auth) {
      if (nextProps.auth !== prevState.auth) {
        if (nextProps.auth.isAuthenticated) {
          if (nextProps.auth.user.project_id !== null) {
            nextProps.history.push(`/${nextProps.auth.user.project_id}/TestCases`);
          } else {
            nextProps.history.push("/Projects");
          }
        }
        if (nextProps.errors) {
          update.errors = nextProps.errors;
        }
      }
    }
    return Object.keys(update).length ? update : null;
  }
  componentWillUnmount() {
    this.setState({ mounted: false });
    this.props.clearErrors();
  }
  componentDidMount() {
    this.setState({ mounted: true });
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/Projects");
    }
  }
  responseGoogle = response => {
    if (this.state.mounted) {
      this.props.loginUser(response);
    }
  };

  render() {
    const { errors } = this.state;
    var loginButton = "Loading...";
    if (this.state.mounted) {
      loginButton = (
        <GoogleLogin
          clientId='423003783080-qknv579ghf7qbe9ji09l7irauhdhtiu5.apps.googleusercontent.com'
          buttonText='Sign in with Google'
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          className={"login-btn"}
          redirectUri={"/Projects"}
          prompt={"consent"}
          ux_mode='redirect'
        />
      );
    }
    return (
      <div className='landing'>
        <div className='landing-content'>
          <div className='landing-content-logo'>
            <img src={htestLogo} alt='htest logo' />
          </div>
          <div className='landing-content-btn'>{loginButton}</div>
          <span className='text-danger'>{errors.email}</span>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser, clearErrors })(withRouter(Landing));
