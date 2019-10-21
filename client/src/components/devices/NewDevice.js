import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { createDevice } from "../../actions/deviceActions";
import { getOffices } from "../../actions/officeActions";
import { superAdminPermissions } from "../../permissions/SuperAdminPermissions";
import Input from "../../components/common/Input";
import Btn from "../../components/common/Btn";
import UnderlineAnchor from "../../components/common/UnderlineAnchor";
import DeviceValidation from "../../validation/DeviceValidation";
import successToast from "../../toast/successToast";
import failToast from "../../toast/failToast";
import { clearErrors } from "../../actions/errorsActions";

import Switch from "../common/Switch";
import GlobalPanel from "../../components/global-panel/GlobalPanel";
import SearchDropdown from "../../components/common/SearchDropdown";
import SettingPanel from "../../components/settings-panel/SettingPanel";
import Header from "../../components/common/Header";

class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      submitPressed: false,
      offices: this.props.offices.offices,
      officesFormatted: [],
      title: "",
      resolution: "",
      office: null,
      ppi: "",
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

  componentDidMount() {
    this.props.getOffices();
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
    deviceData.ppi = this.state.ppi;
    deviceData.udid = this.state.udid;
    deviceData.retina = this.state.retina;
    deviceData.screen_size = this.state.screen_size;
    deviceData.simulator = false;
    deviceData.office_id = this.state.office ? this.state.office.id : null;

    const { errors } = DeviceValidation(deviceData);
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
    deviceData.ppi = this.state.ppi;
    deviceData.udid = this.state.udid;
    deviceData.retina = this.state.retina;
    deviceData.screen_size = this.state.screen_size;
    deviceData.simulator = false;
    deviceData.office_id = this.state.office ? this.state.office.id : null;
    const { errors, isValid } = DeviceValidation(deviceData);

    if (isValid) {
      this.props.createDevice(deviceData, res => {
        if (res.status === 200) {
          successToast("Device added successfully");
          this.props.history.push(`/DeviceSettings`);
        } else {
          failToast("Adding device failed");
          this.props.history.push(`/AddDevice`);
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
        <SettingPanel props={this.props} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-arrow-left"></i>}
            title={"Back To Device Settings"}
            history={this.props}
            canGoBack={true}
            link={`/DeviceSettings`}
          />
          <div className="main-content--content">
            <div className="header">
              <div className="header--title">Device Information </div>
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
                value={this.state.office}
                options={this.state.officesFormatted}
                onChange={this.selectOffice}
                name={"office_id"}
                label={"Office*"}
                validationMsg={this.state.errors.office_id}
                placeholder={"Offices"}
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
                placeholder="Enter Device Ppi Here"
                label="Pixels Per Inch"
                validationMsg={this.state.errors.ppi}
                value={this.state.ppi}
                onChange={e => this.onChange(e)}
                name={"ppi"}
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
                  label="Add Device"
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

AddUser.propTypes = {
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
  { createDevice, getOffices, clearErrors }
)(withRouter(AddUser));
