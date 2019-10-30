import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import EnvironmentValidation from "../../../../validation/EnvironmentValidation";
import isEmpty from "../../../../validation/isEmpty";
import Spinner from "../../../../components/common/Spinner";
import { clearErrors } from "../../../../actions/errorsActions";
import Confirm from "../../../../components/common/Confirm";
import { superAndProjectAdminPermissions } from "../../../../permissions/Permissions";

import Btn from "../../../../components/common/Btn";
import Input from "../../../../components/common/Input";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import Checkbox from "../../../../components/common/Checkbox";
import Header from "../../../../components/common/Header";
import UnderlineAnchor from "../../../../components/common/UnderlineAnchor";
import { getEnvironment, editEnvironment, removeEnvironment } from "../../../../actions/environmentActions";

import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";

class EditEnvironment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      projectId: null,
      environmentId: null,
      environment: this.props.environments.environment,
      title: "",
      deprecated: false,
      used: false,
      errors: {}
    };
  }
  componentDidMount() {
    this.setState({
      projectId: this.props.match.params.projectId,
      environmentId: this.props.match.params.environmentId
    });
    var environmentId = this.props.match.params.environmentId;
    this.props.getEnvironment(environmentId);
  }
  componentWillUnmount() {
    this.props.clearErrors();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    var { environment } = nextProps.environments;
    if (nextProps.environments && nextProps.environments.environment) {
      if (nextProps.environments.environment !== prevState.environment) {
        if (prevState.initialRender) {
          update.initialRender = false;
          update.title = environment.title;
          update.used = environment.used;
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
        nextProps.history.push(`/${nextProps.match.params.projectId}/Environments`);
      }
    }

    return Object.keys(update).length ? update : null;
  }

  checkValidation() {
    var formData = {};

    formData.title = this.state.title;
    formData.used = this.state.used;

    const { errors } = EnvironmentValidation(formData);

    this.setState({ errors });
  }

  submitForm(e) {
    this.props.clearErrors();
    var environmentData = {};
    environmentData.title = this.state.title;
    environmentData.used = this.state.used;
    environmentData.deprecated = this.state.deprecated;
    const { errors, isValid } = EnvironmentValidation(environmentData);

    if (isValid) {
      this.props.editEnvironment(this.state.environmentId, environmentData, res => {
        if (res.status === 200) {
          this.props.history.push(`/${this.state.projectId}/Environments`);

          successToast("Environment successfully edited");
        } else {
          failToast("Environment editing failed");
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
    this.props.removeEnvironment(this.props.match.params.environmentId, res => {
      if (res.status === 200) {
        successToast("Environment removed successfully");
        this.props.history.push(`/${this.state.projectId}/Environments`);
      } else {
        failToast("Something went wrong with removing environment");
      }
    });
  };
  confirmModal = () => {
    var reject = "No";
    var title = "Remove this environment?";
    var msg = "You will not be able to use it in your reports anymore";
    var confirm = "Remove";

    Confirm(title, msg, reject, confirm, e => this.confirmActivation());
  };

  toggleDeprecated() {
    this.setState({ deprecated: !this.state.deprecated });
  }

  render() {
    var { environment, loading } = this.props.environments;

    var content;
    var projectId = this.props.match.params.projectId;
    if (isEmpty(environment) || loading) {
      content = <Spinner />;
    } else {
      content = (
        <div className="main-content--content">
          <div className="header">
            <div className="header--title">Environment Information </div>
            <div className="header--buttons">
              <div className="header--buttons--primary"></div>
              <div className="header--buttons--secondary clickable" onClick={e => this.confirmModal([])}>
                <i className="fas fa-trash-alt"></i>
              </div>
            </div>
          </div>
          <Input
            type="text"
            placeholder="Enter Environment Title"
            label="Title*"
            validationMsg={[this.state.errors.title, this.props.errors.title, this.props.errors.error]}
            value={this.state.title}
            onChange={e => this.onChange(e)}
            name={"title"}
            onKeyDown={this.submitFormOnEnterKey}
          />

          <div className="flex-column-left mt-4">
            <Btn
              className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
              label="Edit Environment"
              type="text"
              onClick={e => this.submitForm(e)}
            />

            <UnderlineAnchor link={`/${projectId}/Environments`} value={"Cancel"} />
          </div>
          <Checkbox
            label="Set environment as deprecated"
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
            title={"Back to All Environments"}
            history={this.props}
            link={`/${projectId}/Environments`}
            canGoBack={true}
          />
          {content}
        </div>
      </div>
    );
  }
}

EditEnvironment.propTypes = {
  environments: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  environments: state.environments,
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getEnvironment, editEnvironment, removeEnvironment, clearErrors }
)(withRouter(EditEnvironment));
