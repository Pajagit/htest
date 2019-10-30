import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { createEnvironment } from "../../../../actions/environmentActions";
import { superAndProjectAdminPermissions } from "../../../../permissions/Permissions";
import Input from "../../../../components/common/Input";
import Btn from "../../../../components/common/Btn";
import UnderlineAnchor from "../../../../components/common/UnderlineAnchor";
import EnvironmentValidation from "../../../../validation/EnvironmentValidation";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";
import { clearErrors } from "../../../../actions/errorsActions";

import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import Header from "../../../../components/common/Header";

class NewEnviroment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      submitPressed: false,
      officesFormatted: [],
      title: "",
      used: true,
      errors: {}
    };
    this.selectOffice = this.selectOffice.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};

    if (nextProps.auth && nextProps.auth.user) {
      var { isValid } = superAndProjectAdminPermissions(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );
    }

    if (!isValid) {
      nextProps.history.push(`/${nextProps.match.params.projectId}/Environments`);
    }

    return Object.keys(update).length ? update : null;
  }

  selectOffice(value) {
    this.setState({ office: value }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }

  checkValidation() {
    var environmentData = {};
    environmentData.title = this.state.title;
    environmentData.project_id = this.props.match.params.projectId;

    const { errors } = EnvironmentValidation(environmentData);
    this.setState({ errors });
  }

  submitForm(e) {
    e.preventDefault();
    this.setState({ submitPressed: true });
    this.props.clearErrors();
    this.setState({ errors: {} });
    var environmentData = {};

    environmentData.title = this.state.title;
    environmentData.used = true;
    environmentData.deprecated = false;
    environmentData.project_id = this.props.match.params.projectId;

    const { errors, isValid } = EnvironmentValidation(environmentData);

    if (isValid) {
      this.props.createEnvironment(environmentData, res => {
        if (res.status === 200) {
          successToast("Environment added successfully");
          this.props.history.push(`/${this.props.match.params.projectId}/Environments`);
        } else {
          failToast("Adding environment failed");
          this.props.history.push(`/${this.props.match.params.projectId}/NewEnviroment`);
        }
      });
    } else {
      this.setState({ errors });
    }
  }

  render() {
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-arrow-left"></i>}
            title={"Back To Environments Settings"}
            history={this.props}
            canGoBack={true}
            link={`/${this.props.match.params.projectId}/Environments`}
          />
          <div className="main-content--content">
            <div className="header">
              <div className="header--title">Environment Information </div>
              <div className="header--buttons">
                <div className="header--buttons--primary"></div>
                <div className="header--buttons--secondary"></div>
              </div>
            </div>
            <div>
              <Input
                type="text"
                placeholder="Enter Environment Title Here"
                label="Title*"
                validationMsg={[this.state.errors.title, this.props.errors.error]}
                value={this.state.title}
                onChange={e => this.onChange(e)}
                name={"title"}
                onKeyDown={this.submitFormOnEnterKey}
              />

              <div className="flex-column-left mt-4">
                <Btn
                  className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
                  label="Add Environment"
                  type="text"
                  onClick={e => this.submitForm(e)}
                />

                <UnderlineAnchor link={`/${this.props.match.params.projectId}/Environments`} value={"Cancel"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NewEnviroment.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  devices: state.devices
});

export default connect(
  mapStateToProps,
  { createEnvironment, clearErrors }
)(withRouter(NewEnviroment));
