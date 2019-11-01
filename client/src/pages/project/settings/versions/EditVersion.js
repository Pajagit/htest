import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import VersionValidation from "../../../../validation/VersionValidation";
import isEmpty from "../../../../validation/isEmpty";
import Spinner from "../../../../components/common/Spinner";
import { clearErrors } from "../../../../actions/errorsActions";
import Confirm from "../../../../components/common/Confirm";
import { superAndProjectAdminPermissions } from "../../../../permissions/Permissions";

import Btn from "../../../../components/common/Btn";
import Input from "../../../../components/common/Input";
import Checkbox from "../../../../components/common/Checkbox";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import Header from "../../../../components/common/Header";
import UnderlineAnchor from "../../../../components/common/UnderlineAnchor";
import { getVersion, editVersion, removeVersion } from "../../../../actions/versionAction";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";

class EditVersion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      projectId: null,
      versionId: null,
      version: this.props.versions.version,
      id: null,
      deprecated: false,
      errors: {}
    };
  }
  componentDidMount() {
    this.setState({ projectId: this.props.match.params.projectId, versionId: this.props.match.params.versionId });
    var versionId = this.props.match.params.versionId;
    this.props.getVersion(versionId);
  }
  componentWillUnmount() {
    this.props.clearErrors();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    var { version } = nextProps.versions;
    if (nextProps.versions && nextProps.versions.version) {
      if (nextProps.versions.version !== prevState.version) {
        if (prevState.initialRender) {
          update.initialRender = false;
          update.version = version.version;
          update.id = version.id;
        }
      }
    }

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

  toggleDeprecated() {
    this.setState({ deprecated: !this.state.deprecated });
  }

  checkValidation() {
    var formData = {};

    formData.version = this.state.version;
    formData.deprecated = this.state.deprecated;

    const { errors } = VersionValidation(formData);

    this.setState({ errors });
  }

  submitForm(e) {
    this.props.clearErrors();
    var versionData = {};
    versionData.version = this.state.version;
    versionData.deprecated = this.state.deprecated;
    console.log(this.state);
    const { errors, isValid } = VersionValidation(versionData);
    console.log(errors);
    if (isValid) {
      this.props.editVersion(this.state.versionId, versionData, res => {
        if (res.status === 200) {
          this.props.history.push(`/${this.state.projectId}/Versions`);

          successToast("Version successfully edited");
        } else {
          failToast("Version editing failed");
        }
      });
    } else {
      this.setState({ errors });
    }
  }

  onChange(e) {
    this.props.clearErrors();
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.checkValidation();
    });
  }

  confirmActivation = e => {
    this.props.removeVersion(this.state.versionId, res => {
      if (res.status === 200) {
        successToast("Version removed successfully");
        this.props.history.push(`/${this.state.projectId}/Versions`);
      } else {
        failToast("Something went wrong with removing version");
      }
    });
  };
  confirmModal = () => {
    var reject = "No";
    var title = "Remove this version?";
    var msg = "You will not be able to use this version in your reports";
    var confirm = "Remove";

    Confirm(title, msg, reject, confirm, e => this.confirmActivation());
  };

  render() {
    var { version, loading } = this.props.versions;

    var content;
    var projectId = this.props.match.params.projectId;
    if (isEmpty(version) || loading) {
      content = <Spinner />;
    } else {
      content = (
        <div className="main-content--content">
          <div className="header">
            <div className="header--title">Version Information </div>
            <div className="header--buttons">
              <div className="header--buttons--primary"></div>
              <div className="header--buttons--secondary clickable" onClick={e => this.confirmModal([])}>
                <i className="fas fa-trash-alt"></i>
              </div>
            </div>
          </div>
          <Input
            type="text"
            placeholder="Enter Version Name"
            label="Version name*"
            validationMsg={[this.state.errors.version, this.props.errors.version, this.props.errors.error]}
            value={this.state.version}
            onChange={e => this.onChange(e)}
            name={"version"}
            onKeyDown={this.submitFormOnEnterKey}
          />

          <div className="flex-column-left mt-4">
            <Btn
              className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
              label="Save Version"
              type="text"
              onClick={e => this.submitForm(e)}
            />

            <UnderlineAnchor link={`/${projectId}/Versions`} value={"Cancel"} />
          </div>
          <Checkbox
            label="Set version as deprecated"
            onClick={e => this.toggleDeprecated(e)}
            name="deprecated"
            value={this.state.deprecated}
          />
        </div>
      );
    }
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

EditVersion.propTypes = {
  testcases: PropTypes.object.isRequired,
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
  { getVersion, editVersion, removeVersion, clearErrors }
)(withRouter(EditVersion));
