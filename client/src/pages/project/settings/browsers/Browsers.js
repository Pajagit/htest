import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getBrowsers, usedBrowser } from "../../../../actions/browserActions";
import { superAndProjectAdminPermissions } from "../../../../permissions/Permissions";
import isEmpty from "../../../../validation/isEmpty";

import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import PortraitBrowser from "../../../../components/common/PortraitBrowser";
import BtnAnchor from "../../../../components/common/BtnAnchor";
import Header from "../../../../components/common/Header";
import Spinner from "../../../../components/common/Spinner";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";

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
    this.props.getBrowsers(this.props.match.params.projectId);
  }

  setUsed(browser) {
    var is_used = !browser.used;

    this.props.usedBrowser(browser.id, is_used, res => {
      if (res.status === 200) {
        if (is_used) {
          successToast(res.data.success);
        } else if (!is_used) {
          successToast(res.data.success);
        }
        this.props.getBrowsers(this.props.match.params.projectId);
      } else {
        failToast(res.error);
      }
    });
  }

  render() {
    var { browsers, loading } = this.props.browsers;
    var browsersContainer;
    var content;
    if (browsers === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(browsers && browsers.browsers)) {
      browsersContainer = browsers.browsers.map((browser, index) => (
        <PortraitBrowser
          key={index}
          title={browser.title}
          resolution={browser.screen_resolution}
          used={browser.used}
          version={browser.version}
          id={browser.id}
          onClick={e => this.setUsed(browser)}
          projectId={this.props.match.params.projectId}
        />
      ));
      content = <div className="testcase-grid testcase-container">{browsersContainer}</div>;
    } else if (isEmpty(browsers && browsers.browsers)) {
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
          {content}
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
  browsers: state.browsers,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getBrowsers, usedBrowser }
)(withRouter(Browsers));
