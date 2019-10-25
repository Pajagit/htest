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
import PortraitBrowser from "../../../../components/common/PortraitBrowser";
import BtnAnchor from "../../../../components/common/BtnAnchor";
import Header from "../../../../components/common/Header";
import Spinner from "../../../../components/common/Spinner";

class Browsers extends Component {
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
    // this.props.getSimulators();
  }

  render() {
    // var { devices, loading } = this.props.devices;
    var browsers = [
      { id: 1, title: "Chrome", version: "11.5", resolution: "1920x1080" },
      { id: 2, title: "Internet Explorer", version: "10.2", resolution: "1920x1080" },
      { id: 1, title: "Chrome", version: "11.5", resolution: "1920x1080" },
      { id: 2, title: "Internet Explorer", version: "10.2", resolution: "1920x1080" },
      { id: 1, title: "Chrome", version: "11.5", resolution: "1920x1080" },
      { id: 2, title: "Internet Explorer", version: "10.2", resolution: "1920x1080" },
      { id: 1, title: "Chrome", version: "11.5", resolution: "1920x1080" },
      { id: 2, title: "Internet Explorer", version: "10.2", resolution: "1920x1080" }
    ];
    var content;

    if (browsers === null) {
      content = <Spinner />;
    } else if (!isEmpty(browsers)) {
      content = browsers.map((browser, index) => (
        <PortraitBrowser
          key={index}
          title={browser.title}
          resolution={browser.resolution}
          version={browser.version}
          id={browser.id}
          projectId={this.props.match.params.projectId}
        />
      ));
    } else if (isEmpty(browsers)) {
      content = <div className="testcase-container-no-content">There are no browsers added yet</div>;
    }

    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="far fa-window-maximize"></i>}
            title={"Browsers"}
            history={this.props}
            canGoBack={false}
            addBtn={
              <BtnAnchor
                type={"text"}
                label="Add Browser"
                disabled={true}
                className={"a-btn a-btn-primary"}
                link={`/${this.state.projectId}/NewBrowser`}
              />
            }
          />
          <div className="testcase-grid testcase-container">{content}</div>
        </div>
      </div>
    );
  }
}

Browsers.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  // browsers: state.browsers,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getSimulators, clearDevices, getDevices }
)(withRouter(Browsers));
