import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { createSimulator } from "../../../../actions/simulatorActions";
import { getOffices } from "../../../../actions/officeActions";
import { superAdminPermissions } from "../../../../permissions/SuperAdminPermissions";
import Input from "../../../../components/common/Input";
import Btn from "../../../../components/common/Btn";
import UnderlineAnchor from "../../../../components/common/UnderlineAnchor";
import SimulatorValidation from "../../../../validation/SimulatorValidation";
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
      resolution: "",
      office: null,
      dpi: "",
      screen_size: "",
      udid: "",
      retina: false,
      errors: {}
    };
    this.selectOffice = this.selectOffice.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};

    if (nextProps.auth && nextProps.auth.user) {
      var { isValid } = superAdminPermissions(nextProps.auth.user.projects, nextProps.auth.user.superadmin);
    }

    if (!isValid) {
      nextProps.history.push(`/DeviceSettings`);
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
    var deviceData = {};
    deviceData.title = this.state.title;
    deviceData.resolution = this.state.resolution;
    deviceData.dpi = this.state.dpi;
    deviceData.udid = this.state.udid;
    deviceData.retina = this.state.retina;
    deviceData.screen_size = this.state.screen_size;
    deviceData.simulator = false;
    deviceData.office_id = this.state.office ? this.state.office.id : null;

    const { errors } = SimulatorValidation(deviceData);
    this.setState({ errors });
  }

  submitForm(e) {
    e.preventDefault();
    this.setState({ submitPressed: true });
    this.props.clearErrors();
    this.setState({ errors: {} });
    var deviceData = {};

    deviceData.title = this.state.title;
    deviceData.resolution = this.state.resolution;
    deviceData.dpi = this.state.dpi;
    deviceData.udid = this.state.udid;
    deviceData.retina = this.state.retina;
    deviceData.screen_size = this.state.screen_size;
    deviceData.simulator = true;
    const { errors, isValid } = SimulatorValidation(deviceData);

    if (isValid) {
      this.props.createSimulator(deviceData, res => {
        if (res.status === 200) {
          successToast("Simulator added successfully");
          this.props.history.push(`/${this.props.match.params.projectId}/Simulators`);
        } else {
          failToast("Adding simulator failed");
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
              <Input
                type="text"
                placeholder="Enter URL Here"
                label="URL"
                validationMsg={[this.state.errors.title, this.props.errors.error]}
                value={this.state.title}
                onChange={e => this.onChange(e)}
                name={"title"}
                onKeyDown={this.submitFormOnEnterKey}
              />

              <div className="flex-column-left mt-4">
                <Btn
                  className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
                  label="Add Version"
                  type="text"
                  onClick={e => this.submitForm(e)}
                />

                <UnderlineAnchor link={`/${this.props.match.params.projectId}/Versions`} value={"Cancel"} />
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
  { createSimulator, getOffices, clearErrors }
)(withRouter(NewEnviroment));
