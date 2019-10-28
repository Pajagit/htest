import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getDevices } from "../../../../actions/deviceActions";
import { projectAdminPermissions } from "../../../../permissions/ProjectRolePermissions";
import { getSimulators } from "../../../../actions/simulatorActions";
import { clearDevices } from "../../../../actions/deviceActions";
import isEmpty from "../../../../validation/isEmpty";

import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import PortraitDevice from "../../../../components/common/PortraitDevice";
import BtnAnchor from "../../../../components/common/BtnAnchor";
import Header from "../../../../components/common/Header";
import Spinner from "../../../../components/common/Spinner";

class Devices extends Component {
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
      var { isValid } = projectAdminPermissions(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );
      if (!isValid) {
        nextProps.history.push(`/${nextProps.match.params.projectId}/TestCases`);
      }
    }

    return Object.keys(update).length ? update : null;
  }
  componentDidMount() {
    this.setState({ projectId: this.props.match.params.projectId });
    this.props.getSimulators();
  }

  render() {
    var { devices, loading } = this.props.devices;
    var content;
    var simulatorContainer;

    if (devices === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(devices.devices)) {
      simulatorContainer = devices.devices.map((device, index) => (
        <PortraitDevice
          key={index}
          title={device.title}
          office={device.office ? device.office.city : ""}
          udid={device.udid}
          resolution={device.resolution}
          dpi={device.dpi}
          os={device.os}
          screen_size={device.screen_size}
          retina={device.retina}
          simulator={true}
          id={device.id}
          projectId={this.props.match.params.projectId}
        />
      ));
      content = <div className="testcase-grid testcase-container">{simulatorContainer}</div>;
    } else if (isEmpty(devices.devices) && isEmpty(this.state.office)) {
      content = <div className="testcase-container-no-content">There are no simulators added yet</div>;
    }

    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-tablet-alt"></i>}
            title={"Simulators"}
            history={this.props}
            canGoBack={false}
            addBtn={
              <BtnAnchor
                type={"text"}
                label="Add Simulator"
                disabled={true}
                className={"a-btn a-btn-primary"}
                link={`/${this.state.projectId}/NewSimulator`}
              />
            }
          />
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
  devices: state.devices,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getSimulators, clearDevices, getDevices }
)(withRouter(Devices));
