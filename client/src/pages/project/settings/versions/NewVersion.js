import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import VersionValidation from "../../../../validation/VersionValidation";
import { superAndProjectAdminPermissions } from "../../../../permissions/Permissions";
import { clearErrors } from "../../../../actions/errorsActions";
import Btn from "../../../../components/common/Btn";
import Input from "../../../../components/common/Input";
import Checkbox from "../../../../components/common/Checkbox";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import Header from "../../../../components/common/Header";
import UnderlineAnchor from "../../../../components/common/UnderlineAnchor";
import { createVersion } from "../../../../actions/versionAction";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";

class NewVersion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      projectId: null,
      version: "",
      user: this.props.auth.user,
      is_supported: true,
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
      var { isValid } = superAndProjectAdminPermissions(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );

      if (!isValid) {
        nextProps.history.push(`/${nextProps.match.params.projectId}/Versions`);
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
  toggleSupported() {
    this.setState({ is_supported: !this.state.is_supported });
  }

  checkValidation() {
    var formData = {};

    formData.title = this.state.title;
    formData.is_supported = this.state.is_supported;

    const { errors } = VersionValidation(formData);

    this.setState({ errors });
  }

  submitForm(e) {
    this.setState({ submitPressed: true });
    this.props.clearErrors();
    var formData = {};
    formData.version = this.state.version;
    formData.is_supported = this.state.is_supported;
    formData.project_id = this.state.projectId;
    const { errors, isValid } = VersionValidation(formData);

    if (isValid) {
      this.props.createVersion(formData, res => {
        if (res.status === 200) {
          this.props.history.push(`/${this.state.projectId}/Versions`);

          successToast("Version successfully created");
        } else {
          failToast("Version creating failed");
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
          placeholder="Enter Version Title"
          label="Version title*"
          validationMsg={[this.state.errors.version, this.props.errors.version]}
          value={this.state.version}
          onChange={e => this.onChange(e)}
          name={"version"}
          onKeyDown={this.submitFormOnEnterKey}
        />
        <Checkbox
          label="Version supported"
          onClick={e => this.toggleSupported(e)}
          name="is_supported"
          value={this.state.is_supported}
        />
        <div className="flex-column-left mt-4">
          <Btn
            className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
            label="Save Group"
            type="text"
            onClick={e => this.submitForm(e)}
          />

          <UnderlineAnchor link={`/${projectId}/Versions`} value={"Cancel"} />
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
            title={"Back to All Versions"}
            history={this.props}
            link={`/${projectId}/Versions`}
            canGoBack={true}
          />
          {content}
        </div>
      </div>
    );
  }
}

NewVersion.propTypes = {
  versions: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases,
  versions: state.versions,
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { createVersion, clearErrors }
)(withRouter(NewVersion));
