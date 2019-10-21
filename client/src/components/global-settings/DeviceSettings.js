import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getDevices } from "../../actions/deviceActions";
import isEmpty from "../../validation/isEmpty";
import { superAdminPermissions } from "../../permissions/SuperAdminPermissions";

import GlobalPanel from "../global-panel/GlobalPanel";
import SettingPanel from "../settings-panel/SettingPanel";
import BtnAnchor from "../common/BtnAnchor";
import Spinner from "../common/Spinner";
import ListItem from "../lists/ListItem";
import Header from "../common/Header";

class DeviceSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      projectId: null,
      user: this.props.auth.user,
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
      var { isValid } = superAdminPermissions(nextProps.auth.user.projects, nextProps.auth.user.superadmin);
      if (!isValid) {
        nextProps.history.push(`/Projects`);
      }
    }
    return Object.keys(update).length ? update : null;
  }

  componentDidMount() {
    this.props.getDevices(1);
  }
  render() {
    var { devices, loading } = this.props.devices;
    var content;
    if (devices === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(devices)) {
      content = (
        <ListItem
          title={"iPhone 6s"}
          img={""}
          list={"10.2 Retina, 4.7” 1334x750 - 326ppi 06f111c45fce3e4b5d"}
          msg={"Nis"}
        />
      );
      content = devices.devices.map((device, index) => (
        <ListItem
          key={index}
          title={device.title}
          msg={device.office.city}
          link={`/EditDevice/${device.id}`}
          list={`${device.retina ? "Retina" : ""}${" "} ${device.screen_size ? device.screen_size : " "}${" "} ${
            device.resolution ? device.resolution : " "
          }${" "} ${device.dpi ? "ppi: " + device.dpi : " "} ${" "}${device.udid ? "udid: " + device.udid : " "}`}
        />
      ));
    } else {
      content = <div className="testcase-container-no-content">There are no devices added yet</div>;
    }

    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <SettingPanel props={this.props} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-laptop"></i>}
            title={"Device Settings"}
            history={this.props}
            canGoBack={false}
            addBtn={<BtnAnchor type={"text"} label="Add Device" className={"a-btn a-btn-primary"} link={`AddDevice`} />}
          />
          <div className="list-item-container">{content}</div>
        </div>
      </div>
    );
  }
}

DeviceSettings.propTypes = {
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
  { getDevices }
)(withRouter(DeviceSettings));
