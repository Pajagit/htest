import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import OsValidation from "../../../../validation/OsValidation";
import isEmpty from "../../../../validation/isEmpty";
import Spinner from "../../../../components/common/Spinner";
import { clearErrors } from "../../../../actions/errorsActions";
import Confirm from "../../../../components/common/Confirm";
import { superAndProjectAdminPermissions } from "../../../../permissions/Permissions";

import Btn from "../../../../components/common/Btn";
import Input from "../../../../components/common/Input";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import Header from "../../../../components/common/Header";
import UnderlineAnchor from "../../../../components/common/UnderlineAnchor";
import { getOperatingSystem, editOperatingSystem, removeOperatingSystem } from "../../../../actions/osActions";

import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";

class EditOperatingSystem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      projectId: null,
      osId: null,
      os: this.props.oss.os,
      title: "",
      deprecated: false,
      errors: {}
    };
  }
  componentDidMount() {
    this.setState({ projectId: this.props.match.params.projectId, osId: this.props.match.params.osId });
    var osId = this.props.match.params.osId;
    this.props.getOperatingSystem(osId);
  }
  componentWillUnmount() {
    this.props.clearErrors();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    var { os } = nextProps.oss;
    if (nextProps.oss && nextProps.oss.os) {
      if (nextProps.oss.os !== prevState.os) {
        if (prevState.initialRender) {
          update.initialRender = false;
          update.title = os.title;
          update.title = os.title ? os.title : "";
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
        nextProps.history.push(`/${nextProps.match.params.projectId}/OperatingSystems`);
      }
    }

    return Object.keys(update).length ? update : null;
  }

  checkValidation() {
    var formData = {};

    formData.title = this.state.title;
    formData.title = this.state.title;
    formData.deprecated = this.state.deprecated;

    const { errors } = OsValidation(formData);

    this.setState({ errors });
  }

  submitForm(e) {
    this.props.clearErrors();
    var osData = {};
    osData.title = this.state.title;
    osData.title = this.state.title;
    osData.deprecated = this.state.deprecated;
    const { errors, isValid } = OsValidation(osData);

    if (isValid) {
      this.props.editOperatingSystem(this.state.osId, osData, res => {
        if (res.status === 200) {
          this.props.history.push(`/${this.state.projectId}/OperatingSystems`);

          successToast("OS successfully edited");
        } else {
          failToast("OS editing failed");
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
    this.props.removeOperatingSystem(this.props.match.params.osId, res => {
      if (res.status === 200) {
        successToast("OS removed successfully");
        this.props.history.push(`/${this.state.projectId}/OperatingSystems`);
      } else {
        failToast("Something went wrong with removing OS");
      }
    });
  };
  confirmModal = () => {
    var reject = "No";
    var title = "Remove this OS?";
    var msg = "You will not be able to use it in you reports anymore";
    var confirm = "Remove";

    Confirm(title, msg, reject, confirm, e => this.confirmActivation());
  };

  toggleDeprecated() {
    this.setState({ deprecated: !this.state.deprecated });
  }

  render() {
    var { os, loading } = this.props.oss;

    var content;
    var projectId = this.props.match.params.projectId;
    if (isEmpty(os) || loading) {
      content = <Spinner />;
    } else {
      content = (
        <div className='main-content--content'>
          <div className='header'>
            <div className='header--title'>Operating System Information </div>
            <div className='header--buttons'>
              <div className='header--buttons--primary'></div>
              <div className='header--buttons--secondary clickable' onClick={e => this.confirmModal([])}>
                <i className='fas fa-trash-alt'></i>
              </div>
            </div>
          </div>
          <Input
            type='text'
            placeholder='Enter Operating System Title'
            label='Title*'
            validationMsg={[this.state.errors.title, this.props.errors.title, this.props.errors.error]}
            value={this.state.title}
            onChange={e => this.onChange(e)}
            name={"title"}
            onKeyDown={this.submitFormOnEnterKey}
          />

          <div className='flex-column-left mt-4'>
            <Btn
              className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
              label='Edit OS'
              type='text'
              onClick={e => this.submitForm(e)}
            />

            <UnderlineAnchor link={`/${projectId}/OperatingSystems`} value={"Cancel"} />
          </div>
        </div>
      );
    }
    return (
      <div className='wrapper'>
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className='main-content main-content-grid'>
          <Header
            icon={<i className='fas fa-arrow-left'></i>}
            title={"Back to All Operating Systems"}
            history={this.props}
            link={`/${projectId}/OperatingSystems`}
            canGoBack={true}
          />
          {content}
        </div>
      </div>
    );
  }
}

EditOperatingSystem.propTypes = {
  oss: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  oss: state.oss,
  errors: state.errors,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getOperatingSystem,
  editOperatingSystem,
  removeOperatingSystem,
  clearErrors
})(withRouter(EditOperatingSystem));
