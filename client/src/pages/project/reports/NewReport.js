import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";

import GlobalPanel from "../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../components/project-panel/ProjectPanel";
import isEmpty from "../../../validation/isEmpty";
import Header from "../../../components/common/Header";
import Spinner from "../../../components/common/Spinner";
import Tag from "../../../components/common/Tag";
import Btn from "../../../components/common/Btn";
import UnderlineAnchor from "../../../components/common/UnderlineAnchor";
import Input from "../../../components/common/Input";

import SearchDropdown from "../../../components/common/SearchDropdown";
import { superAndProjectAdminPermissions } from "../../../permissions/Permissions";
import ReportValidation from "../../../validation/ReportValidation";

import { getTestcase } from "../../../actions/testcaseActions";
import { getDevices } from "../../../actions/deviceActions";
import { getBrowsers } from "../../../actions/browserActions";
import { getVersions } from "../../../actions/versionAction";
import { getEnvironments } from "../../../actions/environmentActions";

class NewReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: false,
      status: null,
      additional_precondition: "",
      actual_result: "",
      comment: "",
      submitPressed: false,
      test_steps: [],
      filteredDevices: [],
      filteredBrowsers: [],
      filteredVersions: [],
      filteredEnvironments: [],
      errors: {}
    };
    this.selectStatus = this.selectStatus.bind(this);
    this.selectBrowser = this.selectBrowser.bind(this);
    this.selectDevice = this.selectDevice.bind(this);
    this.selectVersion = this.selectVersion.bind(this);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    if (nextProps.auth && nextProps.auth.user) {
      var { isValid } = superAndProjectAdminPermissions(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );
      if (!isValid) {
        nextProps.history.push(`${this.props.match.params.projectId}/Testcase/${this.props.match.params.testcaseId}`);
      }
    }

    if (nextProps.devices && nextProps.devices.devices && nextProps.devices.devices.devices) {
      var devices = nextProps.devices.devices.devices;
      var filteredDevices = devices.filter(function(device) {
        return device.used === true;
      });
      update.filteredDevices = filteredDevices;
    }

    if (nextProps.browsers && nextProps.browsers.browsers && nextProps.browsers.browsers.browsers) {
      var browsers = nextProps.browsers.browsers.browsers;
      var filteredBrowsers = browsers.filter(function(browser) {
        return browser.used === true;
      });
      update.filteredBrowsers = filteredBrowsers;
    }
    if (
      nextProps.environments &&
      nextProps.environments.environments &&
      nextProps.environments.environments.environments
    ) {
      var environments = nextProps.environments.environments.environments;
      var filteredEnvironments = environments.filter(function(environment) {
        return environment.used === true;
      });
      update.filteredEnvironments = filteredEnvironments;
    }

    if (nextProps.versions && nextProps.versions.versions && nextProps.versions.versions.versions) {
      var versions = nextProps.versions.versions.versions;
      var filteredVersions = versions.filter(function(version) {
        return version.used === true;
      });
      const versionsMap = filteredVersions.map(function(row) {
        return { id: row.id, title: row.version };
      });
      update.filteredVersions = versionsMap;
    }

    return Object.keys(update).length ? update : null;
  }
  componentDidMount() {
    var testcaseId = this.props.match.params.testcaseId;
    var projectId = this.props.match.params.projectId;
    this.props.getTestcase(testcaseId);
    this.props.getDevices(null, projectId);
    this.props.getBrowsers(projectId);
    this.props.getVersions(projectId);
    this.props.getEnvironments(projectId);
  }
  selectStatus(value) {
    this.setState({ status: value }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }
  selectBrowser(value) {
    this.setState({ browser: value }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }
  selectDevice(value) {
    this.setState({ device: value }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }
  selectVersion(value) {
    this.setState({ version: value }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }
  checkValidation() {
    var formData = {};
    // var testSteps = filterStringArray(this.state.test_steps);
    // var links = filterStringArray(this.state.links);
    // var groups = getIdsFromObjArray(this.state.selectedGroupsObjects);
    // formData.title = this.state.title;
    // formData.description = this.state.description;
    // formData.test_steps = testSteps;
    // formData.expected_result = this.state.expected_result;
    // formData.groups = groups;
    // formData.preconditions = this.state.preconditions;
    // formData.isDeprecated = this.state.isDeprecated;
    formData.status_id = this.state.status ? this.state.status.id : null;
    formData.additional_precondition = this.state.additional_precondition ? this.state.additional_precondition : null;
    formData.actual_result = this.state.actual_result ? this.state.actual_result : null;
    formData.comment = this.state.comment ? this.state.comment : null;
    formData.browser = this.state.browser ? this.state.browser : null;
    formData.device = this.state.device ? this.state.device : null;
    formData.version = this.state.version ? this.state.version : null;

    const { errors } = ReportValidation(formData);

    this.setState({ errors });
  }
  submitForm(e) {
    this.setState({ submitPressed: true });
    e.preventDefault();
    var formData = {};

    // var testSteps = filterStringArray(this.state.test_steps);
    // var links = filterStringArray(this.state.links);
    // var groups = getIdsFromObjArray(this.state.selectedGroupsObjects);
    // formData.title = this.state.title;
    // formData.description = this.state.description;
    // formData.test_steps = testSteps;
    formData.status_id = this.state.status ? this.state.status.id : null;
    formData.additional_precondition = this.state.additional_precondition ? this.state.additional_precondition : null;
    formData.actual_result = this.state.actual_result ? this.state.actual_result : null;
    formData.comment = this.state.comment ? this.state.comment : null;
    formData.browser = this.state.browser ? this.state.browser.id : null;
    formData.device = this.state.device ? this.state.device.id : null;
    formData.version = this.state.version ? this.state.version.id : null;
    console.log(formData);
    const { errors, isValid } = ReportValidation(formData);
    this.setState({ errors });
    if (isValid) {
      console.log(formData);
    } else {
      console.log(errors);
    }
  }
  onChange(e) {
    console.log(e.target);
    if (e.target.name === "input_data") {
      console.log(e.target.id);
    } else if (e.target.name === "expected_result") {
      console.log(e.target.id);
    }
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }

  render() {
    var { testcase } = this.props.testcases;
    var { loading } = this.props.testcases;
    // console.log(this.state);
    var content = "";
    if (isEmpty(testcase) || loading) {
      content = <Spinner />;
    } else {
      var statusValueClass = `${this.state.status !== null ? this.state.status.title.toUpperCase() : ""}-REPORT`;
      content = (
        <div>
          <div className='report-details'>
            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-header'>
                  <div className='report-details-row-half-header-value'>Test Case</div>
                </div>
              </div>
              <div className={`report-details-row-half ${statusValueClass} `}>
                <div className='report-details-row-half-header'>
                  <div className='report-details-row-half-header-value'>Report</div>
                </div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-title'>Title</div>
                <div className='report-details-row-half-value'>{testcase.title}</div>
              </div>
              <div className={`report-details-row-half ${statusValueClass}`}>
                <div className='report-details-row-half-value'>
                  <SearchDropdown
                    options={[
                      { id: 1, title: "Passed" },
                      { id: 2, title: "Failed" }
                    ]}
                    name={"report_status"}
                    value={this.state.status}
                    onChange={this.selectStatus}
                    placeholder={"Report Status"}
                    includeFilterParam={false}
                    validationMsg={this.state.errors.status}
                    multiple={false}
                  />
                </div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-title'>Test Case Created</div>
                <div className='report-details-row-half-value'>
                  {moment(testcase.date).format("Do MMMM YYYY, h:mm:ss a")}
                </div>
              </div>
              <div className={`report-details-row-half ${statusValueClass}`}>
                <div className='report-details-row-half-title'>Reported</div>
                <div className='report-details-row-half-value'>
                  {moment(testcase.created_at).format("Do MMMM YYYY, h:mm:ss a")}
                </div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-title'>Created By</div>
                <div className='report-details-row-half-value'>
                  {testcase.author.first_name + " " + testcase.author.last_name + " EMAIL TO DO"}
                </div>
              </div>
              <div className={`report-details-row-half ${statusValueClass}`}>
                <div className='report-details-row-half-title'>Tested By</div>
                <div className='report-details-row-half-value'>
                  {this.props.auth.user.first_name +
                    " " +
                    this.props.auth.user.last_name +
                    " - " +
                    this.props.auth.user.email}
                </div>
              </div>
            </div>

            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-title'>Precondition</div>
                <div className='report-details-row-half-value'>{testcase.preconditions}</div>
              </div>
              <div className={`report-details-row-half ${statusValueClass}`}>
                <div className='report-details-row-half-value'>
                  <Input
                    placeholder={"Report Precondition"}
                    onChange={e => this.onChange(e)}
                    name={"additional_precondition"}
                    validationMsg={this.state.errors.additional_precondition}
                  />
                </div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-title'>Expected Result</div>
                <div className='report-details-row-half-value'>{testcase.expected_result}</div>
              </div>
              <div className={`report-details-row-half ${statusValueClass}`}>
                <div className='report-details-row-half-value'>
                  <Input
                    placeholder={"Actual Result"}
                    onChange={e => this.onChange(e)}
                    name={"actual_result"}
                    validationMsg={this.state.errors.actual_result}
                  />
                </div>
              </div>
            </div>

            <div className='report-details-row'>
              <div className='report-details-row-full'>
                <div className='report-details-row-full-title'>Description</div>
                <div className='report-details-row-full-value'>{testcase.description}</div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className='report-details-row-full'>
                <div className='report-details-row-full-title'>Groups</div>
                <div className='report-details-row-full-value'>
                  {testcase.groups.map((group, groupIndex) => (
                    <React.Fragment key={groupIndex}>
                      <Tag title={group.title} color={group.color} isRemovable={false} />
                    </React.Fragment>
                  ))}
                </div>
                <br />
              </div>
            </div>
            <div className='report-details-row'>
              <div className={`report-details-row-full ${statusValueClass}`}>
                <div className='report-details-row-full-title'>Comment</div>
                <div className='report-details-row-full-value'>
                  <Input
                    placeholder={"Comment"}
                    onChange={e => this.onChange(e)}
                    name={"comment"}
                    validationMsg={this.state.errors.comment}
                  />
                </div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-title'>Test Steps</div>
                <div className='report-details-row-half-value'>
                  {testcase.test_steps.map((step, index) => (
                    <React.Fragment key={index}>
                      <span key={index}>
                        <div className='steps-class mb-2'>
                          {`${index + 1}. `}
                          {step.value}
                        </div>
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className={`report-details-row-half ${statusValueClass}`}>
                <div className='report-details-row-half-title'>Steps Input Data</div>
                <div className='report-details-row-half-value'>
                  {testcase.test_steps.map((step, index) => (
                    <div key={index} className='steps-class'>
                      <span>
                        <Input
                          placeholder={`${index + 1}. Input Data`}
                          onChange={e => this.onChange(e)}
                          name={`input_data`}
                          id={`i${index + 1}`}
                          noMargin={true}
                          validationMsg={this.state.errors.input_data}
                        />
                        <Input
                          placeholder={`${index + 1}. Expected Result`}
                          onChange={e => this.onChange(e)}
                          name={"expected_result"}
                          id={`e${index + 1}`}
                          noMargin={true}
                          validationMsg={this.state.errors.expected_result}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-title'>Links</div>
                <div className='report-details-row-half-value'>TO DO: https://www.google.com</div>
              </div>
              <div className={`report-details-row-half ${statusValueClass}`}>
                <div className='report-details-row-half-title'>Links</div>
                <div className='report-details-row-half-value'>TO DO: https://www.google.com</div>
              </div>
            </div>

            <div className='report-details-row'>
              <div className={`report-details-row-half ${statusValueClass}`}>
                <div className='report-details-row-half-value'>
                  <SearchDropdown
                    options={this.state.filteredDevices}
                    name={"device"}
                    value={this.state.device}
                    onChange={this.selectDevice}
                    placeholder={"Device"}
                    validationMsg={this.state.errors.device}
                    multiple={false}
                  />
                </div>
              </div>
              <div className={`report-details-row-half ${statusValueClass}`}>
                {/* <div className='report-details-row-half-title'>Browser</div> */}
                <div className='report-details-row-half-value'>
                  <SearchDropdown
                    options={this.state.filteredBrowsers}
                    name={"browser"}
                    value={this.state.browser}
                    onChange={this.selectBrowser}
                    placeholder={"Browser"}
                    validationMsg={this.state.errors.browser}
                    multiple={false}
                  />
                </div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className={`report-details-row-half ${statusValueClass}`}>
                {/* <div className='report-details-row-half-title'>Version</div> */}
                <div className='report-details-row-half-value'>
                  <SearchDropdown
                    options={this.state.filteredVersions}
                    name={"version"}
                    value={this.state.version}
                    onChange={this.selectVersion}
                    placeholder={"Version"}
                    validationMsg={this.state.errors.version}
                    multiple={false}
                  />
                </div>
              </div>
              <div className={`report-details-row-half ${statusValueClass}`}>
                <div className='report-details-row-half-title'>Operating System</div>
                <div className='report-details-row-half-value'>TO DO: No project settings for Operating Systems</div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className={`report-details-row-half ${statusValueClass}`}>
                {/* <div className='report-details-row-half-title'>Environment</div> */}
                <div className='report-details-row-half-value'>
                  <SearchDropdown
                    options={this.state.filteredEnvironments}
                    name={"environment"}
                    value={this.state.environment}
                    onChange={this.selectEnvironment}
                    placeholder={"Environment"}
                    validationMsg={this.state.errors.environment}
                    multiple={false}
                  />
                </div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className='report-details-row-full'>
                <div className='report-details-row-full-title'>
                  <div className='flex-column-left mt-4'>
                    <Btn
                      className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2 mb-1 ml-2`}
                      label='Create Report'
                      type='text'
                      onClick={e => this.submitForm(e)}
                    />
                    <UnderlineAnchor
                      link={`/${this.props.match.params.projectId}/TestCase/${this.props.match.params.testcaseId}`}
                      value={"Cancel"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className='wrapper'>
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className='main-content main-content-grid'>
          <Header
            icon={<i className='fas fa-arrow-left'></i>}
            title={"Back to All Reports"}
            link={`/${this.props.match.params.projectId}/TestCase/${this.props.match.params.testcaseId}`}
            canGoBack={true}
          />
          {content}
        </div>
      </div>
    );
  }
}
NewReport.propTypes = {
  testcases: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases,
  devices: state.devices,
  browsers: state.browsers,
  versions: state.versions,
  environments: state.environments,
  auth: state.auth
});

export default connect(mapStateToProps, { getTestcase, getDevices, getBrowsers, getVersions, getEnvironments })(
  withRouter(NewReport)
);
