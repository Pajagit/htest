import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import isEmpty from "../../../../validation/isEmpty";
import { getGroups } from "../../../../actions/groupsActions";

import PortraitEnvironment from "../../../../components/common/PortraitEnvironment";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import BtnAnchor from "../../../../components/common/BtnAnchor";
import Header from "../../../../components/common/Header";
import Spinner from "../../../../components/common/Spinner";

class Environments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      projectId: null,
      errors: {}
    };
  }
  componentDidMount() {
    this.setState({ projectId: this.props.match.params.projectId });
  }
  render() {
    // var { devices, loading } = this.props.devices;
    var environments = [
      { id: 1, title: "Test", url: "http://www.test-url.com" },
      { id: 2, title: "Development", url: "http://www.development-url.com" },
      { id: 3, title: "Staging", url: "http://www.staging-url.com" },
      { id: 4, title: "Production", url: "http://www.production-url.com" },
      { id: 5, title: "Fleet", url: "http://www.fleet-url.com" },
      { id: 6, title: "SSO", url: "http://www.sso-url.com" }
    ];
    var content;

    if (environments === null) {
      content = <Spinner />;
    } else if (!isEmpty(environments)) {
      content = environments.map((browser, index) => (
        <PortraitEnvironment
          key={index}
          title={browser.title}
          url={browser.url}
          id={browser.id}
          projectId={this.props.match.params.projectId}
        />
      ));
    } else if (isEmpty(environments)) {
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
          <div className="testcase-grid testcase-container">{content}</div>
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
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getGroups }
)(withRouter(Environments));
