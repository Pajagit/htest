import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import BrowserValidation from "../../../../validation/BrowserValidation";
import isEmpty from "../../../../validation/isEmpty";
import Spinner from "../../../../components/common/Spinner";
import { clearErrors } from "../../../../actions/errorsActions";
import Confirm from "../../../../components/common/Confirm";
import { createNewGroupPermission } from "../../../../permissions/GroupPermissions";

import Btn from "../../../../components/common/Btn";
import Input from "../../../../components/common/Input";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import Header from "../../../../components/common/Header";
import UnderlineAnchor from "../../../../components/common/UnderlineAnchor";
import { getBrowser } from "../../../../actions/browserActions";
import { editBrowser } from "../../../../actions/browserActions";
import { removeBrowser } from "../../../../actions/browserActions";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";

class EditBrowser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      projectId: null,
      browserId: null,
      browser: this.props.browsers.browser,
      title: "",
      screen_resolution: "",
      version: "",
      errors: {}
    };
  }
  componentDidMount() {
    this.setState({ projectId: this.props.match.params.projectId, browserId: this.props.match.params.browserId });
    var browserId = this.props.match.params.browserId;
    this.props.getBrowser(browserId);
  }
  componentWillUnmount() {
    this.props.clearErrors();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    var { browser } = nextProps.browsers;
    if (nextProps.browsers && nextProps.browsers.browser) {
      if (nextProps.browsers.browser !== prevState.browser) {
        if (prevState.initialRender) {
          update.initialRender = false;
          update.title = browser.title;
          update.screen_resolution = browser.screen_resolution;
          update.version = browser.version;
        }
      }
    }

    var { user } = nextProps.auth;

    if (nextProps.auth && nextProps.auth.user) {
      if (nextProps.auth.user !== prevState.user) {
        update.user = user;
      }
      var { isValid } = createNewGroupPermission(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );

      if (!isValid) {
        nextProps.history.push(`/${nextProps.match.params.projectId}/Browsers`);
      }
    }

    return Object.keys(update).length ? update : null;
  }

  checkValidation() {
    var formData = {};

    formData.title = this.state.title;
    formData.screen_resolution = this.state.screen_resolution;
    formData.version = this.state.version;

    const { errors } = BrowserValidation(formData);

    this.setState({ errors });
  }

  submitForm(e) {
    this.props.clearErrors();
    var browserData = {};
    browserData.title = this.state.title;
    browserData.screen_resolution = this.state.screen_resolution;
    browserData.version = this.state.version;
    const { errors, isValid } = BrowserValidation(browserData);

    if (isValid) {
      this.props.editBrowser(this.state.browserId, browserData, res => {
        if (res.status === 200) {
          this.props.history.push(`/${this.state.projectId}/Browsers`);

          successToast("Browser successfully edited");
        } else {
          failToast("Browser editing failed");
        }
      });
    } else {
      this.setState({ errors });
    }
  }

  onChange(e) {
    this.props.clearErrors();
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.checkValidation();
    });
  }

  confirmActivation = e => {
    this.props.removeBrowser(this.props.match.params.browserId, res => {
      if (res.status === 200) {
        successToast("Browser removed successfully");
        this.props.history.push(`/${this.state.projectId}/Browsers`);
      } else {
        failToast("Something went wrong with removing browser");
      }
    });
  };
  confirmModal = () => {
    var reject = "No";
    var title = "Remove this browser?";
    var msg = "You will not be able to use it in you reports anymore";
    var confirm = "Remove";

    Confirm(title, msg, reject, confirm, e => this.confirmActivation());
  };

  render() {
    var { browser, loading } = this.props.browsers;

    var content;
    var projectId = this.props.match.params.projectId;
    if (isEmpty(browser) || loading) {
      content = <Spinner />;
    } else {
      content = (
        <div className="main-content--content">
          <div className="header">
            <div className="header--title">Browser Information </div>
            <div className="header--buttons">
              <div className="header--buttons--primary"></div>
              <div className="header--buttons--secondary clickable" onClick={e => this.confirmModal([])}>
                <i className="fas fa-trash-alt"></i>
              </div>
            </div>
          </div>
          <Input
            type="text"
            placeholder="Enter Browser Title"
            label="Title*"
            validationMsg={[this.state.errors.title, this.props.errors.title, this.props.errors.error]}
            value={this.state.title}
            onChange={e => this.onChange(e)}
            name={"title"}
            onKeyDown={this.submitFormOnEnterKey}
          />
          <Input
            type="text"
            placeholder="Enter Browser Version Here"
            label="Version*"
            validationMsg={[this.state.errors.version, this.props.errors.version, this.props.errors.error]}
            value={this.state.version}
            onChange={e => this.onChange(e)}
            name={"version"}
            onKeyDown={this.submitFormOnEnterKey}
          />
          <Input
            type="text"
            placeholder="Enter Browser Resolution Here"
            label="Resolution*"
            validationMsg={[
              this.state.errors.screen_resolution,
              this.props.errors.screen_resolution,
              this.props.errors.error
            ]}
            value={this.state.screen_resolution}
            onChange={e => this.onChange(e)}
            name={"screen_resolution"}
            onKeyDown={this.submitFormOnEnterKey}
          />

          <div className="flex-column-left mt-4">
            <Btn
              className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
              label="Edit Browser"
              type="text"
              onClick={e => this.submitForm(e)}
            />

            <UnderlineAnchor link={`/${projectId}/Browsers`} value={"Cancel"} />
          </div>
        </div>
      );
    }
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-arrow-left"></i>}
            title={"Back to All Browsers"}
            history={this.props}
            link={`/${projectId}/Browsers`}
            canGoBack={true}
          />
          {content}
        </div>
      </div>
    );
  }
}

EditBrowser.propTypes = {
  browsers: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  browsers: state.browsers,
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getBrowser, editBrowser, removeBrowser, clearErrors }
)(withRouter(EditBrowser));
