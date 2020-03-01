import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { superAndProjectAdminPermissions } from "../../../../permissions/Permissions";
import { getSimulators, simulatorIsUsed } from "../../../../actions/simulatorActions";
import isEmpty from "../../../../validation/isEmpty";

import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import PortraitDevice from "../../../../components/common/PortraitDevice";
import BtnAnchor from "../../../../components/common/BtnAnchor";
import Header from "../../../../components/common/Header";
import Spinner from "../../../../components/common/Spinner";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";

class Simulators extends Component {
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
      var { isValid } = superAndProjectAdminPermissions(
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
    this.props.getSimulators(this.props.match.params.projectId);
  }
  changeIsUsed(id, used) {
    this.props.simulatorIsUsed(id, used, this.props.match.params.projectId, res => {
      if (res.status === 200) {
        successToast(res.data.success);
      } else {
        failToast("Something went wrong");
      }
      this.props.getSimulators(this.props.match.params.projectId);
    });
  }
  render() {
    var { simulators, loading } = this.props.simulators;
    var content;
    var simulatorContainer;

    if (simulators === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(simulators.simulators)) {
      simulatorContainer = simulators.simulators.map((simulator, index) => (
        <PortraitDevice
          key={index}
          title={simulator.title}
          office={simulator.office ? simulator.office.city : ""}
          udid={simulator.udid}
          resolution={simulator.resolution}
          dpi={simulator.dpi}
          os={simulator.os}
          screen_size={simulator.screen_size}
          retina={simulator.retina}
          simulator={true}
          id={simulator.id}
          projectId={this.props.match.params.projectId}
          isUsed={simulator.used}
          changeIsUsed={e => this.changeIsUsed(simulator.id, !simulator.used)}
          emulator={simulator.emulator}
        />
      ));
      content = <div className="testcase-grid testcase-container">{simulatorContainer}</div>;
    } else if (isEmpty(simulators.simulators) && isEmpty(this.state.office)) {
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

Simulators.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  simulators: state.simulators,
  errors: state.errors
});

export default connect(mapStateToProps, { getSimulators, simulatorIsUsed })(withRouter(Simulators));
