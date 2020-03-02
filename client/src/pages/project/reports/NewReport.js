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
import FullBtn from "../../../components/common/FullBtn";
import InputGroup from "../../../components/common/InputGroup";

import SearchDropdown from "../../../components/common/SearchDropdown";
import { superAndProjectAdminPermissions } from "../../../permissions/Permissions";
import ReportValidation from "../../../validation/ReportValidation";
import successToast from "../../../toast/successToast";
import failToast from "../../../toast/failToast";

import { getTestcase } from "../../../actions/testcaseActions";
import { getDevices } from "../../../actions/deviceActions";
import { getBrowsers } from "../../../actions/browserActions";
import { getVersions } from "../../../actions/versionAction";
import { getEnvironments } from "../../../actions/environmentActions";
import { getStatuses } from "../../../actions/statusActions";
import { getOperatingSystems } from "../../../actions/osActions";
import { getSimulators } from "../../../actions/simulatorActions";
import { createReport } from "../../../actions/reportActions";

class NewReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: false,
      status: null,
      additional_precondition: "",
      actual_result: "",
      comment: "",
      reportLinks: [],
      submitPressed: false,
      test_steps: [],
      filteredOperatingSystems: [],
      filteredDevices: [],
      filteredBrowsers: [],
      filteredVersions: [],
      filteredEnvironments: [],
      filteredSimulators: [],
      errors: {}
    };
    this.selectStatus = this.selectStatus.bind(this);
    this.selectBrowser = this.selectBrowser.bind(this);
    this.selectDevice = this.selectDevice.bind(this);
    this.selectVersion = this.selectVersion.bind(this);
    this.selectEnvironment = this.selectEnvironment.bind(this);
    this.selectOperatingSystem = this.selectOperatingSystem.bind(this);
    this.selectSimulator = this.selectSimulator.bind(this);
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

    if (nextProps.simulators && nextProps.simulators.simulators && nextProps.simulators.simulators.simulators) {
      var simulators = nextProps.simulators.simulators.simulators;
      var filteredSimulators = simulators.filter(function(device) {
        return device.used === true;
      });
      update.filteredSimulators = filteredSimulators;
    }

    if (nextProps.browsers && nextProps.browsers.browsers && nextProps.browsers.browsers.browsers) {
      var browsers = nextProps.browsers.browsers.browsers;
      var filteredBrowsers = browsers.filter(function(browser) {
        return browser.used === true;
      });
      update.filteredBrowsers = filteredBrowsers;
    }

    if (nextProps.oss && nextProps.oss.oss && nextProps.oss.oss.oss) {
      var oss = nextProps.oss.oss.oss;
      var filteredoss = oss.filter(function(oss) {
        return oss.used === true;
      });
      update.filteredOperatingSystems = filteredoss;
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
    this.props.getOperatingSystems(projectId);
    this.props.getEnvironments(projectId);
    this.props.getSimulators(projectId);
    this.props.getStatuses();
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
  selectSimulator(value) {
    this.setState({ simulator: value }, () => {
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
  selectEnvironment(value) {
    this.setState({ environment: value }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }
  selectOperatingSystem(value) {
    this.setState({ os: value }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }

  addColumnLink(e) {
    var links = this.state.reportLinks;
    links.push({ id: links.length, value: "" });
    this.setState({ links });
  }
  removeColumnLink(e) {
    var indexToRemove = e.target.id.substring(5);
    var links = this.state.reportLinks;
    links.splice(indexToRemove, 1);
    this.setState({ links }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }

  checkValidation() {
    var formData = {};
    formData.status_id = this.state.status ? this.state.status.id : null;
    formData.additional_precondition = this.state.additional_precondition ? this.state.additional_precondition : null;
    formData.actual_result = this.state.actual_result ? this.state.actual_result : null;
    formData.comment = this.state.comment ? this.state.comment : null;
    formData.browser = this.state.browser ? this.state.browser : null;
    formData.device = this.state.device ? this.state.device : null;
    formData.simulator = this.state.simulator ? this.state.simulator : null;
    formData.version = this.state.version ? this.state.version : null;
    formData.environment = this.state.environment ? this.state.environment : null;
    formData.steps = this.state.inputSteps ? this.state.inputSteps : null;
    formData.links = this.state.reportLinks;

    const { errors } = ReportValidation(formData);

    this.setState({ errors });
  }
  submitForm(e) {
    this.setState({ submitPressed: true });
    e.preventDefault();
    var formData = {};
    formData.test_case_id = this.props.match.params.testcaseId;
    formData.status_id = this.state.status ? this.state.status.id : null;
    formData.additional_precondition = this.state.additional_precondition ? this.state.additional_precondition : null;
    formData.actual_result = this.state.actual_result ? this.state.actual_result : null;
    formData.comment = this.state.comment ? this.state.comment : null;
    formData.browser_id = this.state.browser ? this.state.browser.id : null;
    formData.device_id = this.state.device ? this.state.device.id : null;
    formData.version_id = this.state.version ? this.state.version.id : null;
    formData.simulator_id = this.state.simulator ? this.state.simulator.id : null;
    formData.environment_id = this.state.environment ? this.state.environment.id : null;
    formData.operating_system_id = this.state.os ? this.state.os.id : null;
    formData.steps = this.state.inputSteps ? this.state.inputSteps : null;
    formData.links = this.state.reportLinks;
    const { errors, isValid } = ReportValidation(formData);
    this.setState({ errors });
    if (isValid) {
      this.props.createReport(formData, res => {
        if (res.status === 200) {
          this.props.history.push(
            `/${this.props.match.params.projectId}/TestCase/${this.props.match.params.testcaseId}`
          );
          successToast("Report created successfully");
        } else {
          failToast("Report creating failed");
        }
      });
    } else {
      console.log(errors);
    }
  }
  onChange(e) {
    if (e.target.name === "input_data") {
      var steps = this.props.testcases.testcase.test_steps;
      steps[e.target.id - 1]["input_data"] = e.target.value;

      const stepsMap = steps.map(function(row) {
        return { id: row.id, step: row.value, input_data: row.input_data };
      });
      this.setState({ inputSteps: stepsMap }, () => {
        if (this.state.submitPressed) {
          this.checkValidation();
        }
      });
    }
    if (e.target.id === "link") {
      var enteredLinks = this.state.links;
      enteredLinks[e.target.name.substring(5)].value = e.target.value;
      this.setState({ reportLinks: enteredLinks }, () => {
        if (this.state.submitPressed) {
          this.checkValidation();
        }
      });
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
    var { statuses } = this.props.statuses;
    var content = "";
    if (isEmpty(testcase) || loading || isEmpty(statuses)) {
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
                    options={statuses}
                    name={"report_status"}
                    value={this.state.status}
                    onChange={this.selectStatus}
                    placeholder={"Report Status*"}
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
                  {testcase.author.first_name + " " + testcase.author.last_name + " - " + testcase.author.email}
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
                          id={`${index + 1}`}
                          noMargin={true}
                          validationMsg={index === 0 ? this.state.errors.step : ""}
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
                <div className='report-details-row-half-value'>
                  {testcase.links.map((link, index) => (
                    <div key={index}>
                      <span>
                        {`${index + 1}. `}
                        {link.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`report-details-row-half ${statusValueClass}`}>
                <div className='report-details-row-half-title'>Links</div>
                <div className='report-details-row-half-value'>
                  <InputGroup
                    type='text'
                    placeholder='Add Link here'
                    // label='Links'
                    values={this.state.reportLinks}
                    onChange={e => this.onChange(e)}
                    id={"link"}
                    validationMsg={this.state.errors.links}
                    addColumn={<FullBtn placeholder='Add links' onClick={e => this.addColumnLink(e)} />}
                    removeColumn={e => this.removeColumnLink(e)}
                    required={false}
                    disabled={false}
                    onKeyDown={this.submitFormOnEnterKey}
                  />
                </div>
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
                <div className='report-details-row-half-value'>
                  <SearchDropdown
                    options={this.state.filteredOperatingSystems}
                    name={"operating_systems"}
                    value={this.state.os}
                    onChange={this.selectOperatingSystem}
                    placeholder={"Operating System"}
                    validationMsg={this.state.errors.operating_system}
                    multiple={false}
                  />
                </div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className={`report-details-row-half ${statusValueClass}`}>
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
              <div className={`report-details-row-half ${statusValueClass}`}>
                <div className='report-details-row-half-value'>
                  <SearchDropdown
                    options={this.state.filteredSimulators}
                    name={"simulator"}
                    value={this.state.simulator}
                    onChange={this.selectSimulator}
                    placeholder={"Simulator"}
                    validationMsg={this.state.errors.simulator}
                    multiple={false}
                  />
                </div>
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
  oss: state.oss,
  statuses: state.statuses,
  simulators: state.simulators,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getTestcase,
  getDevices,
  getBrowsers,
  getVersions,
  getEnvironments,
  getStatuses,
  getOperatingSystems,
  getSimulators,
  createReport
})(withRouter(NewReport));
