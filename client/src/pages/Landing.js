import React, { Component } from "react";
import htestLogo from "../img/htest-logo.png";
import isEmpty from "../validation/isEmpty";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { loginUser } from "../actions/authActions";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      errors: ""
    };
  }
  responseGoogle = response => {
    console.log(response);
    if (response.type !== "tokenFailed") {
      // console.log(response);
      // var profile = response.getBasicProfile();
      this.setState({ user: response });
      // console.log("ID: " + profile.getId());
      // console.log("Name: " + profile.getName());
      // console.log("Image URL: " + profile.getImageUrl());
      // console.log("Email: " + profile.getEmail());
      // console.log("TokenId: " + response.tokenId);
      // var id_token = response.getAuthResponse().id_token;
      // console.log(id_token);

      this.props.loginUser(response, () => {
        this.props.history.push("/Projects");
      });
    } else {
      this.setState({ errors: response.type });
    }
  };
  logout = () => {
    this.setState({ user: {} });
    console.log("user logged out");
  };
  render() {
    var googleBtn;

    if (isEmpty(this.state.user)) {
      googleBtn = (
        <GoogleLogin
          clientId="19117053252-nqhee0c2nmovdumnub6tee623hdgkfoo.apps.googleusercontent.com"
          buttonText="Sign in with Google"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          redirectUri={"/Projects"}
          // hostedDomain={"htecgroup.com"}
          ux_mode="redirect"
          cookiePolicy={"single_host_origin"}
        />
      );
    } else if (!isEmpty(this.state.user)) {
      googleBtn = (
        <GoogleLogout
          clientId="19117053252-nqhee0c2nmovdumnub6tee623hdgkfoo.apps.googleusercontent.com"
          buttonText="Logout"
          onLogoutSuccess={this.logout}
        ></GoogleLogout>
      );
    }
    return (
      <div className="landing">
        <div className="landing-logo">
          <img src={htestLogo} alt="htest logo" />
        </div>
        <div className="landing-btn">{googleBtn}</div>
        {this.state.errors}
      </div>
    );
  }
}

Landing.propTypes = {
  // testcases: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  // testcases: state.testcases
  // auth: state.auth,
});

export default connect(
  mapStateToProps,
  { loginUser }
)(withRouter(Landing));
