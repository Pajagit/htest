import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getDevice, editDevice, removeDevice } from "../../../../actions/deviceActions";
import { getOffices } from "../../../../actions/officeActions";
import { superAdminPermissions } from "../../../../permissions/Permissions";
import Input from "../../../../components/common/Input";
import Btn from "../../../../components/common/Btn";
import UnderlineAnchor from "../../../../components/common/UnderlineAnchor";
import DeviceValidation from "../../../../validation/DeviceValidation";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";
import { clearErrors } from "../../../../actions/errorsActions";
import { getMobileOs } from "../../../../actions/mobileOsActions";
import isEmpty from "../../../../validation/isEmpty";

import Spinner from "../../../../components/common/Spinner";
import Switch from "../../../../components/common/Switch";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import SearchDropdown from "../../../../components/common/SearchDropdown";
import SettingPanel from "../../../../components/settings-panel/SettingPanel";
import Confirm from "../../../../components/common/Confirm";
import Header from "../../../../components/common/Header";

class EditDevice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      offices: this.props.offices.offices,
      office: [],
      device: this.props.devices.device,
      mobileOSs: [],
      officesFormatted: [],
      title: "",
      resolution: "",
      dpi: "",
      os: [],
      screen_size: "",
      udid: "",
      retina: false,
      errors: {}
    };
    this.selectOffice = this.selectOffice.bind(this);
    this.selectOs = this.selectOs.bind(this);
  }
  componentDidMount() {
    this.props.getOffices();
    this.props.getDevice(this.props.match.params.deviceId);
    this.props.getMobileOs();
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};

    if (nextProps.auth && nextProps.auth.user) {
      var { isValid } = superAdminPermissions(nextProps.auth.user.superadmin);
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
        var formatedOffice = device.office;
        formatedOffice.title = formatedOffice["city"];
        delete formatedOffice.city;
        update.office = formatedOffice;
        update.os = { id: device.os, title: device.os };
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
    if (nextProps.mobileOSs && nextProps.mobileOSs.mobileOSs) {
      if (nextProps.mobileOSs.mobileOSs !== prevState.mobileOSs) {
        update.mobileOSs = nextProps.mobileOSs.mobileOSs;

        var mobileOSs = nextProps.mobileOSs.mobileOSs.operating_systems;

        update.mobileOSs = mobileOSs;
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
    deviceData.os = this.state.os.title;
    deviceData.simulator = false;
    deviceData.office_id = this.state.office ? this.state.office.id : null;

    const { errors } = DeviceValidation(deviceData);
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
    deviceData.os = this.state.os.title;
    deviceData.simulator = false;
    deviceData.office_id = this.state.office ? this.state.office.id : null;
    const { errors, isValid } = DeviceValidation(deviceData);

    if (isValid) {
      this.props.editDevice(this.props.match.params.deviceId, deviceData, res => {
        if (res.status === 200) {
          successToast("Device edited successfully");
          this.props.history.push(`/DeviceSettings`);
        } else {
          failToast("Editing device failed");
          this.props.history.push(`/EditDevice${this.props.match.params.deviceId}`);
        }
      });
    } else {
      this.setState({ errors });
    }
  }

  confirmActivation = e => {
    this.props.removeDevice(this.props.match.params.deviceId, res => {
      if (res.status === 200) {
        successToast("Device removed successfully");
        this.props.history.push(`/DeviceSettings`);
      } else {
        failToast("Something went wrong with removing group");
      }
    });
  };
  confirmModal = () => {
    var reject = "No";
    var title = "Remove this device?";
    var msg = "Users will not be able to use it on their projects anymore";
    var confirm = "Remove";

    Confirm(title, msg, reject, confirm, e => this.confirmActivation());
  };

  selectOs(value) {
    this.setState({ os: value }, () => {
      this.checkValidation();
    });
  }

  render() {
    var content;
    var { device, loading } = this.props.devices;
    if (isEmpty(device) || loading) {
      content = <Spinner />;
    } else {
      content = (
        <div className="main-content--content">
          <div className="header">
            <div className="header--title">Device Information </div>
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
            <SearchDropdown
              value={this.state.office}
              options={this.state.officesFormatted}
              onChange={this.selectOffice}
              name={"office_id"}
              label={"Office*"}
              validationMsg={this.state.errors.office_id}
              placeholder={"Offices"}
              multiple={false}
            />
            <SearchDropdown
              value={this.state.os}
              options={this.state.mobileOSs}
              onChange={this.selectOs}
              name={"operating_system"}
              label={"Operating System*"}
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
            <Input
              type="text"
              placeholder="Enter Device Udid Here"
              label="Unique Device Identifier"
              validationMsg={this.state.errors.udid}
              value={this.state.udid}
              onChange={e => this.onChange(e)}
              name={"udid"}
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

              <UnderlineAnchor link={`/DeviceSettings`} value={"Cancel"} />
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
            title={"Back To Device Settings"}
            history={this.props}
            canGoBack={true}
            link={`/DeviceSettings`}
          />

          {content}
        </div>
      </div>
    );
  }
}

EditDevice.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  devices: state.devices,
  offices: state.offices,
  mobileOSs: state.mobileOSs
});

export default connect(
  mapStateToProps,
  { getDevice, editDevice, removeDevice, getOffices, getMobileOs, clearErrors }
)(withRouter(EditDevice));
