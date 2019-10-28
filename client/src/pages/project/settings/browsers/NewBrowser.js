import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import BrowserValidation from "../../../../validation/BrowserValidation";
import { createNewGroupPermission } from "../../../../permissions/GroupPermissions";
import { clearErrors } from "../../../../actions/errorsActions";
import Btn from "../../../../components/common/Btn";
import Input from "../../../../components/common/Input";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import Header from "../../../../components/common/Header";
import UnderlineAnchor from "../../../../components/common/UnderlineAnchor";
import { createBrowser } from "../../../../actions/browserActions";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";

class NewBrowser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      projectId: null,
      title: "",
      user: this.props.auth.user,
      screen_resolution: "",
      version: "",
      submitPressed: false,
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
      var { isValid } = createNewGroupPermission(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );

      if (!isValid) {
        nextProps.history.push(`/${nextProps.match.params.projectId}/Groups`);
      }
    }
    return Object.keys(update).length ? update : null;
  }

  componentDidMount() {
    this.setState({ projectId: this.props.match.params.projectId });
  }
  componentWillUnmount() {
    this.props.clearErrors();
  }

  checkValidation() {
    var formData = {};

    formData.title = this.state.title;
    formData.screen_resolution = this.state.screen_resolution;
    formData.version = this.state.version;

    const { errors } = BrowserValidation(formData);

    this.setState({ errors });
  }

  submitForm(e) {
    this.setState({ submitPressed: true });
    this.props.clearErrors();
    var browserData = {};
    browserData.title = this.state.title;
    browserData.screen_resolution = this.state.screen_resolution;
    browserData.version = this.state.version;
    browserData.project_id = this.props.match.params.projectId;
    const { errors, isValid } = BrowserValidation(browserData);

    if (isValid) {
      this.props.createBrowser(browserData, res => {
        if (res.status === 200) {
          this.props.history.push(`/${this.state.projectId}/Browsers`);

          successToast("Browser successfully created");
        } else {
          failToast("Browser creating failed");
        }
      });
    } else {
      this.setState({ errors });
    }
  }

  onChange(e) {
    this.props.clearErrors();
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }

  render() {
    var content;
    var projectId = this.props.match.params.projectId;
    content = (
      <div className="main-content--content">
        <Input
          type="text"
          placeholder="Enter Browser Title Here"
          label="Title*"
          validationMsg={[this.state.errors.title, this.props.errors.title]}
          value={this.state.title}
          onChange={e => this.onChange(e)}
          name={"title"}
          onKeyDown={this.submitFormOnEnterKey}
        />
        <Input
          type="text"
          placeholder="Enter Browser Version Here"
          label="Version"
          validationMsg={[this.state.errors.version, this.props.errors.version]}
          value={this.state.version}
          onChange={e => this.onChange(e)}
          name={"version"}
          onKeyDown={this.submitFormOnEnterKey}
        />
        <Input
          type="text"
          placeholder="Enter Browser Resolution Here"
          label="Resolution"
          validationMsg={[this.state.errors.screen_resolution, this.props.errors.screen_resolution]}
          value={this.state.screen_resolution}
          onChange={e => this.onChange(e)}
          name={"screen_resolution"}
          onKeyDown={this.submitFormOnEnterKey}
        />
        <div className="flex-column-left mt-4">
          <Btn
            className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
            label="Save Group"
            type="text"
            onClick={e => this.submitForm(e)}
          />

          <UnderlineAnchor link={`/${projectId}/Browsers`} value={"Cancel"} />
        </div>
      </div>
    );

    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-arrow-left"></i>}
            title={"Back to All Browsers"}
            history={this.props}
            link={`/${projectId}/Browsers`}
            canGoBack={true}
          />
          {content}
        </div>
      </div>
    );
  }
}

NewBrowser.propTypes = {
  browsers: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  browsers: state.browsers,
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { createBrowser, clearErrors }
)(withRouter(NewBrowser));
