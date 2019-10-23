import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getDevices } from "../../../../actions/deviceActions";
import { projectAdminPermissions } from "../../../../permissions/ProjectRolePermissions";
import { getOffices } from "../../../../actions/officeActions";
import { getSimulators } from "../../../../actions/simulatorActions";
import getIdsFromObjArray from "../../../../utility/getIdsFromObjArray";
import isEmpty from "../../../../validation/isEmpty";

// import Checkbox from "../../../../components/common/Checkbox";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
// import ListItem from "../../../../components/lists/ListItem";
import PortraitDevice from "../../../../components/common/PortraitDevice";
import BtnAnchor from "../../../../components/common/BtnAnchor";
import SearchDropdown from "../../../../components/common/SearchDropdown";
import Switch from "../../../../components/common/Switch";
import Header from "../../../../components/common/Header";
import Spinner from "../../../../components/common/Spinner";

class Devices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      projectId: null,
      offices: this.props.offices.offices,
      office: [],
      officesFormatted: [],
      deviceType: false,
      user: this.props.auth.user,
      errors: {}
    };
    this.toggleDeviceType = this.toggleDeviceType.bind(this);
    this.selectOffice = this.selectOffice.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    var { user } = nextProps.auth;
    if (nextProps.auth && nextProps.auth.user) {
      if (nextProps.auth.user !== prevState.user) {
        update.user = user;
      }
      var { isValid } = projectAdminPermissions(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );
      if (!isValid) {
        nextProps.history.push(`/${nextProps.match.params.projectId}/TestCases`);
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
  componentDidMount() {
    this.setState({ projectId: this.props.match.params.projectId });
    this.props.getDevices();
    this.props.getOffices();
  }

  toggleDeviceType() {
    this.setState({ office: [] });
    this.setState({ deviceType: !this.state.deviceType }, () => {
      if (this.state.deviceType) {
        this.props.getSimulators();
      } else {
        this.props.getDevices();
      }
    });
  }

  selectOffice(value) {
    this.setState({ office: value }, () => {
      var officesIds = getIdsFromObjArray(this.state.office);
      this.props.getDevices({ offices: officesIds });
    });
  }
  render() {
    var { devices, loading } = this.props.devices;
    var content;
    var link = "";
    if (this.state.deviceType) {
      link = `/EditSimulator/`;
    }
    if (devices === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(devices.devices)) {
      content = devices.devices.map((device, index) => (
        <PortraitDevice
          key={index}
          title={device.title}
          office={device.office ? device.office.city : ""}
          udid={device.udid}
          resolution={device.resolution}
          dpi={device.dpi}
          screen_size={device.screen_size}
          retina={device.retina}
          type={this.state.deviceType}
          id={device.id}
          projectId={this.props.match.params.projectId}
        />
      ));
    } else if (isEmpty(devices.devices) && isEmpty(this.state.office)) {
      content = <div className="testcase-container-no-content">There are no devices added yet</div>;
    } else if (!isEmpty(this.state.office)) {
      content = <div className="testcase-container-no-content">There are no devices for selected office</div>;
    }

    var pageTitle = "";
    var officeFilter = "";
    if (this.state.deviceType) {
      pageTitle = "Simulators";
    } else {
      pageTitle = "Devices";
      officeFilter = (
        <SearchDropdown
          value={this.state.office}
          options={this.state.officesFormatted}
          onChange={this.selectOffice}
          name={"office_id"}
          label={""}
          validationMsg={this.state.errors.office_id}
          placeholder={"Offices"}
          multiple={true}
        />
      );
    }
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-tablet-alt"></i>}
            title={"Devices"}
            history={this.props}
            canGoBack={false}
            addBtn={
              <BtnAnchor
                type={"text"}
                label="Add Simulator"
                disabled={true}
                className={"a-btn a-btn-primary"}
                link={`/${this.state.projectId}/CreateNewGroup`}
              />
            }
          />
          <div className="list-item-container">
            <div className="header">
              <div className="header--title">{pageTitle} </div>
              <div className="header--buttons">
                <div className="header--buttons--primary">
                  <Switch
                    label={"Devices / Simulators"}
                    value={this.state.retina}
                    onClick={this.toggleDeviceType}
                    name={"retina"}
                  />
                </div>
                <div className="header--buttons--secondary clickable"></div>
              </div>
            </div>
          </div>
          <div className="testcase-grid">{officeFilter}</div>

          <div className="testcase-grid testcase-container">{content}</div>
        </div>
      </div>
    );
  }
}

Devices.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  offices: state.offices,
  devices: state.devices,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getOffices, getSimulators, getDevices }
)(withRouter(Devices));
