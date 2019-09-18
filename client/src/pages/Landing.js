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
      errors: {}
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    if (nextProps.auth) {
      if (nextProps.auth !== prevState.auth) {
        if (nextProps.auth.isAuthenticated) {
          nextProps.history.push("/Projects");
        }
        if (nextProps.errors) {
          update.errors = nextProps.errors;
        }
      }
    }
    return Object.keys(update).length ? update : null;
  }
  componentWillUnmount() {
    this.props.clearErrors();
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/Projects");
    }
  }
  responseGoogle = response => {
    this.props.loginUser(response);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="landing">
        <div className="landing-content">
          <div className="landing-content-logo">
            <img src={htestLogo} alt="htest logo" />
          </div>
          <div className="landing-content-btn">
            <GoogleLogin
              clientId="19117053252-nqhee0c2nmovdumnub6tee623hdgkfoo.apps.googleusercontent.com"
              buttonText="Sign in with Google"
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
              redirectUri={"/Projects"}
              ux_mode="redirect"
              cookiePolicy={"single_host_origin"}
            />
          </div>
          <span className="text-danger">{errors.email}</span>
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
  // testcases: state.testcases
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser, clearErrors }
)(withRouter(Landing));
