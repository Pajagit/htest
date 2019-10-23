import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getSimulator, editSimulator, removeSimulator } from "../../../../actions/simulatorActions";
import { getOffices } from "../../../../actions/officeActions";
import { superAdminPermissions } from "../../../../permissions/SuperAdminPermissions";
import Input from "../../../../components/common/Input";
import Btn from "../../../../components/common/Btn";
import UnderlineAnchor from "../../../../components/common/UnderlineAnchor";
import SimulatorValidation from "../../../../validation/SimulatorValidation";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";
import { clearErrors } from "../../../../actions/errorsActions";
import isEmpty from "../../../../validation/isEmpty";

import Spinner from "../../../../components/common/Spinner";
import Switch from "../../../../components/common/Switch";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import SettingPanel from "../../../../components/settings-panel/SettingPanel";
import Confirm from "../../../../components/common/Confirm";
import Header from "../../../../components/common/Header";

class EditSimulator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      offices: this.props.offices.offices,
      office: [],
      device: this.props.devices.device,
      officesFormatted: [],
      title: "",
      resolution: "",
      dpi: "",
      screen_size: "",
      udid: "",
      retina: false,
      errors: {}
    };
    this.selectOffice = this.selectOffice.bind(this);
  }
  componentDidMount() {
    this.props.getSimulator(this.props.match.params.simulatorId);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};

    if (nextProps.auth && nextProps.auth.user) {
      var { isValid } = superAdminPermissions(nextProps.auth.user.projects, nextProps.auth.user.superadmin);
    }

    if (!isValid) {
      nextProps.history.push(`/DeviceSettings`);
    }
    var { device } = nextProps.devices;
    if (nextProps.devices.device !== prevState.device) {
      if (prevState.initialRender) {
        update.initialRender = false;

        update.title = device.title;
        update.resolution = device.resolution ? device.resolution : "";
        update.dpi = device.dpi ? device.dpi : "";
        update.udid = device.udid ? device.udid : "";
        update.retina = device.retina;
        update.screen_size = device.screen_size ? device.screen_size : "";
      }
    }

    if (nextProps.offices && nextProps.offices.offices) {
      if (nextProps.offices.offices !== prevState.offices) {
        update.offices = nextProps.offices.offices;

        var offices = nextProps.offices.offices;
        var i;
        for (i = 0; i < offices.length; i++) {
          offices[i].title = offices[i]["city"];
          delete offices[i].city;
        }
        update.officesFormatted = offices;
      }
    }

    return Object.keys(update).length ? update : null;
  }

  selectOffice(value) {
    this.setState({ office: value }, () => {
      this.checkValidation();
    });
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.checkValidation();
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
    deviceData.simulator = true;

    const { errors } = SimulatorValidation(deviceData);
    this.setState({ errors });
  }

  submitForm(e) {
    e.preventDefault();
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
      this.props.editSimulator(this.props.match.params.simulatorId, deviceData, res => {
        if (res.status === 200) {
          successToast("Simulator edited successfully");
          this.props.history.push(`/${this.props.match.params.projectId}/Simulators`);
        } else {
          failToast("Editing simulator failed");
          this.props.history.push(
            `${this.props.match.params.projectId}/EditSimulator${this.props.match.params.simulatorId}`
          );
        }
      });
    } else {
      this.setState({ errors });
    }
  }

  confirmActivation = e => {
    this.props.removeSimulator(this.props.match.params.simulatorId, res => {
      if (res.status === 200) {
        successToast("Simulator removed successfully");
        this.props.history.push(`/${this.props.match.params.projectId}/Simulators`);
      } else {
        failToast("Something went wrong with removing group");
      }
    });
  };
  confirmModal = () => {
    var reject = "No";
    var title = "Remove this simulator?";
    var msg = "Users will not be able to use it on their projects anymore";
    var confirm = "Remove";

    Confirm(title, msg, reject, confirm, e => this.confirmActivation());
  };

  render() {
    var content;
    var { device, loading } = this.props.devices;

    if (isEmpty(device) || loading) {
      content = <Spinner />;
    } else {
      content = (
        <div className="main-content--content">
          <div className="header">
            <div className="header--title">Simulator Information </div>
            <div className="header--buttons">
              <div className="header--buttons--primary">
                <div className="header--buttons--secondary clickable" onClick={e => this.confirmModal([])}>
                  <i className="fas fa-trash-alt"></i>
                </div>
              </div>
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
                label="Edit Device"
                type="text"
                onClick={e => this.submitForm(e)}
              />

              <UnderlineAnchor link={`/${this.props.match.params.projectId}/Simulators`} value={"Cancel"} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <SettingPanel props={this.props} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-arrow-left"></i>}
            title={"Back To Simulators"}
            history={this.props}
            canGoBack={true}
            link={`/${this.props.match.params.projectId}/Simulators`}
          />

          {content}
        </div>
      </div>
    );
  }
}

EditSimulator.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  devices: state.devices,
  offices: state.offices
});

export default connect(
  mapStateToProps,
  { getSimulator, editSimulator, removeSimulator, getOffices, clearErrors }
)(withRouter(EditSimulator));
