import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getDevices, clearDevices, deviceIsUsed } from "../../../../actions/deviceActions";
import { superAndProjectAdminPermissions } from "../../../../permissions/Permissions";
import { getOffices } from "../../../../actions/officeActions";
import getIdsFromObjArray from "../../../../utility/getIdsFromObjArray";
import isEmpty from "../../../../validation/isEmpty";

import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import PortraitDevice from "../../../../components/common/PortraitDevice";
import SearchDropdown from "../../../../components/common/SearchDropdown";
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
      devices: null,
      user: this.props.auth.user,
      errors: {}
    };
    this.selectOffice = this.selectOffice.bind(this);
    this.changeIsUsed = this.changeIsUsed.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
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

    if (nextProps.devices && nextProps.devices.devices) {
      if (nextProps.devices.devices !== prevState.devices) {
        update.devices = nextProps.devices.devices;

        var devices = nextProps.devices.devices;

        update.devices = devices.devices;
      }
    }

    return Object.keys(update).length ? update : null;
  }
  componentDidMount() {
    this.setState({ projectId: this.props.match.params.projectId });
    this.props.getDevices(null, this.props.match.params.projectId);
    this.props.getOffices();
  }

  selectOffice(value) {
    this.setState({ office: value }, () => {
      var officesIds = getIdsFromObjArray(this.state.office);
      this.props.getDevices(officesIds, this.props.match.params.projectId);
    });
  }

  changeIsUsed(id, used) {
    function changeDesc(id, used, callback) {
      for (var i in newArray) {
        if (newArray[i].id === id) {
          newArray[i].used = used;
          break;
        }
      }
      callback();
    }

    var newArray = this.state.devices;
    this.props.deviceIsUsed(id, used, this.props.match.params.projectId, () => {
      changeDesc(id, used, () => {

        this.setState({ devices: newArray })
      });
    })
  }
  render() {
    var { loading } = this.props.devices;

    var devices = [];
    if (this.state.devices) {
      devices = this.state.devices;
    }
    var content;
    var deviceContainer;

    if (devices === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(devices)) {
      deviceContainer = devices.map((device, index) => (
        <PortraitDevice
          key={index}
          title={device.title}
          office={device.office ? device.office.city : ""}
          udid={device.udid}
          resolution={device.resolution}
          dpi={device.dpi}
          screen_size={device.screen_size}
          os={device.os}
          retina={device.retina}
          type={this.state.deviceType}
          id={device.id}
          projectId={this.props.match.params.projectId}
          isUsed={device.used}
          changeIsUsed={e => this.changeIsUsed(device.id, !device.used)}
        />
      ));
      content = <div className="testcase-grid testcase-container">{deviceContainer}</div>;
    } else if (isEmpty(devices.devices) && isEmpty(this.state.office)) {
      content = <div className="testcase-container-no-content">There are no devices added yet</div>;
    } else if (!isEmpty(this.state.office)) {
      content = <div className="testcase-container-no-content">There are no devices for selected office</div>;
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
          />
          <div className="testcase-grid">
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
          </div>

          {content}
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
  { getOffices, clearDevices, getDevices, deviceIsUsed }
)(withRouter(Devices));
