import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import OsValidation from "../../../../validation/OsValidation";
import { superAndProjectAdminPermissions } from "../../../../permissions/Permissions";
import { clearErrors } from "../../../../actions/errorsActions";
import Btn from "../../../../components/common/Btn";
import Input from "../../../../components/common/Input";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import Header from "../../../../components/common/Header";
import UnderlineAnchor from "../../../../components/common/UnderlineAnchor";
import { createOperatingSystem } from "../../../../actions/osActions";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";

class NewOperatingSystem extends Component {
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
      var { isValid } = superAndProjectAdminPermissions(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );

      if (!isValid) {
        nextProps.history.push(`/${nextProps.match.params.projectId}/OperatingSystems`);
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
    formData.deprecated = false;

    const { errors } = OsValidation(formData);

    this.setState({ errors });
  }

  submitForm(e) {
    this.setState({ submitPressed: true });
    this.props.clearErrors();
    var osData = {};
    osData.title = this.state.title;
    osData.deprecated = false;
    osData.used = true;
    osData.project_id = this.props.match.params.projectId;
    const { errors, isValid } = OsValidation(osData);

    if (isValid) {
      this.props.createOperatingSystem(osData, res => {
        if (res.status === 200) {
          this.props.history.push(`/${this.state.projectId}/OperatingSystems`);

          successToast("OS successfully created");
        } else {
          failToast("OS creating failed");
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
      <div className='main-content--content'>
        <Input
          type='text'
          placeholder='Enter Operating System Title Here'
          label='Title*'
          validationMsg={[this.state.errors.title, this.props.errors.title]}
          value={this.state.title}
          onChange={e => this.onChange(e)}
          name={"title"}
          onKeyDown={this.submitFormOnEnterKey}
        />

        <div className='flex-column-left mt-4'>
          <Btn
            className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
            label='Save OS'
            type='text'
            onClick={e => this.submitForm(e)}
          />

          <UnderlineAnchor link={`/${projectId}/OperatingSystems`} value={"Cancel"} />
        </div>
      </div>
    );

    return (
      <div className='wrapper'>
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className='main-content main-content-grid'>
          <Header
            icon={<i className='fas fa-arrow-left'></i>}
            title={"Back to All Operating Systems"}
            history={this.props}
            link={`/${projectId}/Operating Systems`}
            canGoBack={true}
          />
          {content}
        </div>
      </div>
    );
  }
}

NewOperatingSystem.propTypes = {
  oss: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  oss: state.oss,
  errors: state.errors,
  auth: state.auth
});

export default connect(mapStateToProps, { createOperatingSystem, clearErrors })(withRouter(NewOperatingSystem));
