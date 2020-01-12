import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import isEmpty from "../../../../validation/isEmpty";
import { getTestSetup, usedTestSetup } from "../../../../actions/testSetupActions";
import { superAndProjectAdminPermissions } from "../../../../permissions/Permissions";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import Header from "../../../../components/common/Header";
import SetupProperty from "../../../../components/common/SetupProperty";
import Spinner from "../../../../components/common/Spinner";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";

class TestSetup extends Component {
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
    this.props.getTestSetup(this.props.match.params.projectId);
  }

  setUsed(testSetup, projectId) {
    var is_used = !testSetup.used;

    this.props.usedTestSetup(projectId, testSetup.id, is_used, res => {
      if (res.status === 200) {
        if (is_used) {
          successToast(res.data.success);
        } else if (!is_used) {
          successToast(res.data.success);
        }
        this.props.getTestSetup(this.props.match.params.projectId);
      } else {
        failToast(res.error);
      }
    });
  }
  render() {
    var { testSetup, loading } = this.props.testSetup;
    var content;

    if (testSetup === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(testSetup)) {
      content = testSetup.map((setupProperty, index) => (
        <SetupProperty
          key={index}
          title={setupProperty.title}
          used={setupProperty.used}
          id={setupProperty.id}
          projectId={this.props.match.params.projectId}
          onClick={e => this.setUsed(setupProperty, this.props.match.params.projectId)}
        />
      ));
    }
    return (
      <div className='wrapper'>
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className='main-content main-content-grid'>
          <Header icon={<i className='fas fa-cogs'></i>} title={"Test Setup"} history={this.props} canGoBack={false} />
          <div className='list-item-container'>{content}</div>
          {/* <SetupProperty setupProperties={setupProperties} /> */}
        </div>
      </div>
    );
  }
}

TestSetup.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  testSetup: state.testSetup
});

export default connect(mapStateToProps, { getTestSetup, usedTestSetup })(withRouter(TestSetup));
