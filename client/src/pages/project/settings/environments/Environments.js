import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import isEmpty from "../../../../validation/isEmpty";
import { getEnvironments, usedEnvironment } from "../../../../actions/environmentActions";
import { superAndProjectAdminPermissions } from "../../../../permissions/Permissions";

import PortraitEnvironment from "../../../../components/common/PortraitEnvironment";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import BtnAnchor from "../../../../components/common/BtnAnchor";
import Header from "../../../../components/common/Header";
import Spinner from "../../../../components/common/Spinner";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";

class Environments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      projectId: null,
      errors: {}
    };
    this.setUsed = this.setUsed.bind(this);
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
      nextProps.history.push(`/${nextProps.match.params.projectId}/TestCases`);
    }

    return Object.keys(update).length ? update : null;
  }

  componentDidMount() {
    this.setState({ projectId: this.props.match.params.projectId });
    this.props.getEnvironments(this.props.match.params.projectId);
  }
  setUsed(environment) {
    var is_used = !environment.used;

    this.props.usedEnvironment(environment.id, is_used, res => {
      if (res.status === 200) {
        if (is_used) {
          successToast(res.data.success);
        } else if (!is_used) {
          successToast(res.data.success);
        }
        this.props.getEnvironments(this.props.match.params.projectId);
      } else {
        failToast(res.error);
      }
    });
  }
  render() {
    var { environments, loading } = this.props.environments;
    var environmentsContainer;
    var content;

    if (environments === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(environments.environments)) {
      environmentsContainer = environments.environments.map((environment, index) => (
        <PortraitEnvironment
          key={index}
          title={environment.title}
          used={environment.used}
          id={environment.id}
          projectId={this.props.match.params.projectId}
          onClick={e => this.setUsed(environment)}
        />
      ));
      content = <div className="testcase-grid testcase-container">{environmentsContainer}</div>;
    } else if (isEmpty(environments && environments.environments)) {
      content = <div className="testcase-container-no-content">There are no environments added yet</div>;
    }
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fab fa-dev"></i>}
            title={"Environments"}
            history={this.props}
            canGoBack={false}
            addBtn={
              <BtnAnchor
                type={"text"}
                label="Add Environment"
                disabled={true}
                className={"a-btn a-btn-primary"}
                link={`/${this.state.projectId}/NewEnvironment`}
              />
            }
          />
          {content}
        </div>
      </div>
    );
  }
}

Environments.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  environments: state.environments
});

export default connect(
  mapStateToProps,
  { getEnvironments, usedEnvironment }
)(withRouter(Environments));
