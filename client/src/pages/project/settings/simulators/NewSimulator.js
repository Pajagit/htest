import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { createSimulator } from "../../../../actions/simulatorActions";
import { getMobileOs } from "../../../../actions/mobileOsActions";
import { getOffices } from "../../../../actions/officeActions";
import { superAndProjectAdminPermissions } from "../../../../permissions/Permissions";
import Input from "../../../../components/common/Input";
import Btn from "../../../../components/common/Btn";
import UnderlineAnchor from "../../../../components/common/UnderlineAnchor";
import SimulatorValidation from "../../../../validation/SimulatorValidation";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";
import { clearErrors } from "../../../../actions/errorsActions";

import SearchDropdown from "../../../../components/common/SearchDropdown";
import Switch from "../../../../components/common/Switch";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import Header from "../../../../components/common/Header";

class NewSimulator extends Component {
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
      os: [],
      screen_size: "",
      udid: "",
      retina: false,
      errors: {}
    };
    this.selectOs = this.selectOs.bind(this);
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
      nextProps.history.push(`/${nextProps.match.params.projectId}/Simulators`);
    }
    if (nextProps.mobileOSs && nextProps.mobileOSs.mobileOSs) {
      if (nextProps.mobileOSs.mobileOSs !== prevState.mobileOSs) {
        update.mobileOSs = nextProps.mobileOSs.mobileOSs;
        var mobileOSs = nextProps.mobileOSs.mobileOSs.operating_systems;
        update.mobileOSs = mobileOSs;
      }
    }

    return Object.keys(update).length ? update : null;
  }
  componentDidMount() {
    this.props.getMobileOs();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }
  selectOs(value) {
    this.setState({ os: value }, () => {
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
    deviceData.os = this.state.os.title;
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
    deviceData.os = this.state.os.title;

    const { errors, isValid } = SimulatorValidation(deviceData);

    if (isValid) {
      this.props.createSimulator(deviceData, res => {
        if (res.status === 200) {
          successToast("Simulator added successfully");
          this.props.history.push(`/${this.props.match.params.projectId}/Simulators`);
        } else {
          failToast("Adding simulator failed");
          this.props.history.push(`/${this.props.match.params.projectId}/NewSimulator`);
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
            title={"Back To Simulator Settings"}
            history={this.props}
            canGoBack={true}
            link={`/${this.props.match.params.projectId}/Simulators`}
          />
          <div className="main-content--content">
            <div className="header">
              <div className="header--title">Simulator Information </div>
              <div className="header--buttons">
                <div className="header--buttons--primary"></div>
                <div className="header--buttons--secondary"></div>
              </div>
            </div>
            <div>
              <Input
                type="text"
                placeholder="Enter Device Title Here"
                label="Title*"
                validationMsg={[this.state.errors.title, this.props.errors.error]}
                value={this.state.title}
                onChange={e => this.onChange(e)}
                name={"title"}
                onKeyDown={this.submitFormOnEnterKey}
              />
              <SearchDropdown
                value={this.state.os}
                options={this.state.mobileOSs}
                onChange={this.selectOs}
                name={"operating_system"}
                label={"Operating System*"}
                validationMsg={[this.state.errors.os, this.props.errors.os]}
                placeholder={"Operating Systems"}
                multiple={false}
              />
              <Input
                type="text"
                placeholder="Enter Device Resolution Here"
                label="Resolution"
                validationMsg={this.state.errors.resolution}
                value={this.state.resolution}
                onChange={e => this.onChange(e)}
                name={"resolution"}
                onKeyDown={this.submitFormOnEnterKey}
              />

              <Input
                type="text"
                placeholder="Enter Device Screen Size Here"
                label="Screen Size"
                validationMsg={this.state.errors.screen_size}
                value={this.state.screen_size}
                onChange={e => this.onChange(e)}
                name={"screen_size"}
                onKeyDown={this.submitFormOnEnterKey}
              />
              <Input
                type="text"
                placeholder="Enter Device dpi Here"
                label="Pixels Per Inch"
                validationMsg={this.state.errors.dpi}
                value={this.state.dpi}
                onChange={e => this.onChange(e)}
                name={"dpi"}
                onKeyDown={this.submitFormOnEnterKey}
              />
              <Switch
                label={"Retina"}
                value={this.state.retina}
                onClick={e => this.setState({ retina: !this.state.retina })}
                name={"retina"}
              />
              <div className="flex-column-left mt-4">
                <Btn
                  className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
                  label="Add Simulator"
                  type="text"
                  onClick={e => this.submitForm(e)}
                />

                <UnderlineAnchor link={`/DeviceSettings`} value={"Cancel"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NewSimulator.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  devices: state.devices,
  mobileOSs: state.mobileOSs
});

export default connect(
  mapStateToProps,
  { createSimulator, getOffices, getMobileOs, clearErrors }
)(withRouter(NewSimulator));
