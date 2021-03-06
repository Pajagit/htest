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
import InputGroupDouble from "../../../components/common/InputGroupDouble";
import openExternalBtn from "../../../img/openExternalBtn.png";

import SearchDropdown from "../../../components/common/SearchDropdown";
import { projectIdAndSuperAdminPermission, writePermissions } from "../../../permissions/Permissions";
import ReportValidation from "../../../validation/ReportValidation";
import checkIfElemInObjInArray from "../../../utility/checkIfElemInObjInArray";
import successToast from "../../../toast/successToast";
import failToast from "../../../toast/failToast";

import { getReport, clearReport } from "../../../actions/reportActions";
import { getReportFilters } from "../../../actions/filterActions";
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
      report: this.props.reports && this.props.reports.report,
      submitPressed: false,
      test_steps: [],
      filteredOperatingSystems: [],
      filteredDevices: [],
      filteredBrowsers: [],
      device: [],
      browser: [],
      version: [],
      os: [],
      simulator: [],
      environment: [],
      filteredVersions: [],
      filteredEnvironments: [],
      currentTime: moment().format("Do MMMM YYYY, h:mm:ss a"),
      filteredSimulators: [],
      setupItemsKeys: [],
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
      var isValidWrite = writePermissions(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );
      update.isValidWrite = isValidWrite.isValid;
      var { isValid } = projectIdAndSuperAdminPermission(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );
      update.isValid = isValid;

      if (nextProps.auth.user !== prevState.user) {
        update.user = nextProps.auth.user;
      }
      if (!isValid) {
        nextProps.history.push(`/${nextProps.match.params.projectId}/Reports`);
      } else if (!isValidWrite.isValid) {
        nextProps.history.push(`/${nextProps.match.params.projectId}/Reports`);
      }
    }

    if (nextProps.report_filters && nextProps.report_filters.report_filters) {
      const setupItemKeys = Object.keys(nextProps.report_filters.report_filters.setup);

      update.statuses = nextProps.report_filters.report_filters.statuses;
      const activeSetupItemsKeys = setupItemKeys.filter(function(id) {
        return nextProps.report_filters.report_filters.setup[id];
      });
      update.setupItemsKeys = activeSetupItemsKeys;

      var filteredUsedDevices = nextProps.report_filters.report_filters.devices.filter(function(device) {
        return device.used === true;
      });
      const mappedDevices = filteredUsedDevices.map(function(row) {
        return { id: row.id, title: `${row.title} - (${row.office.city})`, used: row.used };
      });
      update.filteredDevices = mappedDevices;

      if (
        checkIfElemInObjInArray(
          prevState.filteredDevices,
          nextProps.reports.report &&
            nextProps.reports.report.reportsetup &&
            nextProps.reports.report.reportsetup.device &&
            nextProps.reports.report.reportsetup.device.id
        )
      ) {
        update.device =
          nextProps.reports.report.reportsetup && nextProps.reports.report.reportsetup.device
            ? nextProps.reports.report.reportsetup.device
            : [];
      }

      var filteredUsedSimulators = nextProps.report_filters.report_filters.simulators.filter(function(simulator) {
        return simulator.used === true;
      });
      update.filteredSimulators = filteredUsedSimulators;

      if (
        checkIfElemInObjInArray(
          filteredUsedSimulators,
          nextProps.reports.report &&
            nextProps.reports.report.reportsetup &&
            nextProps.reports.report.reportsetup.simulator &&
            nextProps.reports.report.reportsetup.simulator.id
        )
      ) {
        update.simulator =
          nextProps.reports.report.reportsetup && nextProps.reports.report.reportsetup.simulator
            ? nextProps.reports.report.reportsetup.simulator
            : [];
      }

      var filteredUsedBrowsers = nextProps.report_filters.report_filters.browsers.filter(function(browser) {
        return browser.used === true;
      });
      update.filteredBrowsers = filteredUsedBrowsers;

      if (
        checkIfElemInObjInArray(
          prevState.filteredBrowsers,
          nextProps.reports.report &&
            nextProps.reports.report.reportsetup &&
            nextProps.reports.report.reportsetup.browser &&
            nextProps.reports.report.reportsetup.browser.id
        )
      ) {
        update.browser =
          nextProps.reports.report.reportsetup && nextProps.reports.report.reportsetup.browser
            ? nextProps.reports.report.reportsetup.browser
            : [];
      }

      var filteredUsedOperatingSystems = nextProps.report_filters.report_filters.operatingsystems.filter(function(os) {
        return os.used === true;
      });
      update.filteredOperatingSystems = filteredUsedOperatingSystems;

      if (
        checkIfElemInObjInArray(
          prevState.filteredOperatingSystems,
          nextProps.reports.report &&
            nextProps.reports.report.reportsetup &&
            nextProps.reports.report.reportsetup.operatingsystem &&
            nextProps.reports.report.reportsetup.operatingsystem.id
        )
      ) {
        update.os =
          nextProps.reports.report.reportsetup && nextProps.reports.report.reportsetup.operatingsystem
            ? nextProps.reports.report.reportsetup.operatingsystem
            : [];
      }

      var filteredUsedVersions = nextProps.report_filters.report_filters.versions.filter(function(version) {
        return version.used === true;
      });

      const versionsMap = filteredUsedVersions.map(function(row) {
        return { id: row.id, title: row.version };
      });
      update.filteredVersions = versionsMap;

      var versionRemapped =
        nextProps.reports.report && nextProps.reports.report.reportsetup && nextProps.reports.report.reportsetup.version
          ? nextProps.reports.report.reportsetup.version
          : [];
      versionRemapped.title = versionRemapped.version;

      if (checkIfElemInObjInArray(versionsMap, versionRemapped.id)) {
        update.version = versionRemapped ? versionRemapped : [];
      }

      var filteredUsedEnvironments = nextProps.report_filters.report_filters.environments.filter(function(environment) {
        return environment.used === true;
      });

      update.filteredEnvironments = filteredUsedEnvironments;

      if (
        checkIfElemInObjInArray(
          filteredUsedEnvironments,
          nextProps.reports.report &&
            nextProps.reports.report.reportsetup &&
            nextProps.reports.report.reportsetup.environment &&
            nextProps.reports.report.reportsetup.environment.id
        )
      ) {
        update.environment =
          nextProps.reports.report.reportsetup && nextProps.reports.report.reportsetup.environment
            ? nextProps.reports.report.reportsetup.environment
            : [];
      }
    }

    if (nextProps.reports.report !== prevState.report) {
      update.report = nextProps.reports.report;
      update.additional_precondition = nextProps.reports.report.additional_precondition
        ? nextProps.reports.report.additional_precondition
        : "";
      update.actual_result = nextProps.reports.report.actual_result ? nextProps.reports.report.actual_result : "";
      update.steps = nextProps.reports.report && nextProps.reports.report.steps ? nextProps.reports.report.steps : [];
      update.reportLinks =
        nextProps.reports.report && nextProps.reports.report.links ? nextProps.reports.report.links : [];
      update.comment =
        nextProps.reports.report && nextProps.reports.report.comment ? nextProps.reports.report.comment : "";
    }

    return Object.keys(update).length ? update : null;
  }
  componentDidMount() {
    var projectId = this.props.match.params.projectId;
    var reportId = this.props.match.params.reportId;
    this.props.getReportFilters(projectId);
    this.props.getReport(reportId);
    this.interval = setInterval(this.updateCurrentTime.bind(this), 1000);
  }
  updateCurrentTime() {
    this.setState({ currentTime: moment().format("Do MMMM YYYY, h:mm:ss a") });
  }
  componentWillUnmount() {
    clearInterval(this.interval);
    this.props.clearReport();
  }
  selectStatus(value) {
    this.setState({ status: value }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }
  selectBrowser(value) {
    if (JSON.stringify(this.state.browser) !== JSON.stringify(value)) {
      this.setState({ browser: value }, () => {
        if (this.state.submitPressed) {
          this.checkValidation();
        }
      });
    } else {
      this.setState({ browser: null });
    }
  }
  selectDevice(value) {
    if (JSON.stringify(this.state.device) !== JSON.stringify(value)) {
      this.setState({ device: value }, () => {
        if (this.state.submitPressed) {
          this.checkValidation();
        }
      });
    } else {
      this.setState({ device: null });
    }
  }
  selectSimulator(value) {
    if (JSON.stringify(this.state.simulator) !== JSON.stringify(value)) {
      this.setState({ simulator: value }, () => {
        if (this.state.submitPressed) {
          this.checkValidation();
        }
      });
    } else {
      this.setState({ simulator: null });
    }
  }
  selectVersion(value) {
    if (JSON.stringify(this.state.version) !== JSON.stringify(value)) {
      this.setState({ version: value }, () => {
        if (this.state.submitPressed) {
          this.checkValidation();
        }
      });
    } else {
      this.setState({ version: null });
    }
  }
  selectEnvironment(value) {
    if (JSON.stringify(this.state.environment) !== JSON.stringify(value)) {
      this.setState({ environment: value }, () => {
        if (this.state.submitPressed) {
          this.checkValidation();
        }
      });
    } else {
      this.setState({ environment: null });
    }
  }
  selectOperatingSystem(value) {
    if (JSON.stringify(this.state.os) !== JSON.stringify(value)) {
      this.setState({ os: value }, () => {
        if (this.state.submitPressed) {
          this.checkValidation();
        }
      });
    } else {
      this.setState({ os: null });
    }
  }

  addColumnLink(e) {
    var reportLinks = this.state.reportLinks;
    reportLinks.push({ id: reportLinks.length, value: "", title: "" });
    this.setState({ reportLinks });
  }
  removeColumnLink(e) {
    var indexToRemove = e.target.id.substring(12);
    var reportLinks = this.state.reportLinks;
    reportLinks.splice(indexToRemove, 1);
    this.setState({ reportLinks }, () => {
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
  submitForm(e, openTestCase) {
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
          if (openTestCase) {
            this.props.history.push(
              `/${this.props.match.params.projectId}/TestCase/${this.props.match.params.testcaseId}`
            );
          } else {
            this.props.history.push(`/${this.props.match.params.projectId}/Report/${res.data.id}`);
          }
          successToast("Report created successfully");
        } else {
          failToast("Report creating failed");
        }
      });
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
    if (e.target.id.substring(0, 5) === "value") {
      var enteredLinks = this.state.reportLinks;
      enteredLinks[e.target.name.substring(6)].value = e.target.value;
      this.setState({ reportLinks: enteredLinks }, () => {
        if (this.state.submitPressed) {
          this.checkValidation();
        }
      });
    } else if (e.target.id.substring(0, 5) === "title") {
      var enteredLinkTitles = this.state.reportLinks;
      enteredLinkTitles[e.target.name.substring(6)].title = e.target.value;
      this.setState({ reportLinks: enteredLinkTitles }, () => {
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
    var { report, loading } = this.props.reports;
    var content = "";

    if (isEmpty(report) || loading || isEmpty(this.state.statuses)) {
      content = <Spinner />;
    } else {
      var statusValueClass = `${
        this.state.status && this.state.status.title ? this.state.status.title.toUpperCase() : ""
      }-REPORT`;
      var deviceComponent = "";
      if (this.state.setupItemsKeys.includes("devices")) {
        deviceComponent = (
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
        );
      }
      var browserComponent = "";
      if (this.state.setupItemsKeys.includes("browsers")) {
        browserComponent = (
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
        );
      }
      var versionComponent = "";
      if (this.state.setupItemsKeys.includes("versions")) {
        versionComponent = (
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
        );
      }
      var operatingSystemComponent = "";
      if (this.state.setupItemsKeys.includes("operatingsystems")) {
        operatingSystemComponent = (
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
        );
      }
      var environmentComponent = "";
      if (this.state.setupItemsKeys.includes("environments")) {
        environmentComponent = (
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
        );
      }
      var simulatorComponent = "";
      if (this.state.setupItemsKeys.includes("simulators")) {
        simulatorComponent = (
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
        );
      }
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
                <div className='report-details-row-half-value'>{report.testcase.title}</div>
              </div>
              <div className={`report-details-row-half ${statusValueClass}`}>
                <div className='report-details-row-half-value'>
                  <SearchDropdown
                    options={this.state.statuses}
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
                  {moment(report.testcase.date).format("Do MMMM YYYY, h:mm:ss a")}
                </div>
              </div>
              <div className={`report-details-row-half ${statusValueClass}`}>
                <div className='report-details-row-half-title'>Reported</div>
                <div className='report-details-row-half-value'>{this.state.currentTime}</div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-title'>Created By</div>
                <div className='report-details-row-half-value'>
                  {report.testcase.user.first_name +
                    " " +
                    report.testcase.user.last_name +
                    " - " +
                    report.testcase.user.email}
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
                <div className='report-details-row-half-value'>{report.testcase.preconditions}</div>
              </div>
              <div className={`report-details-row-half ${statusValueClass}`}>
                <div className='report-details-row-half-value'>
                  <Input
                    placeholder={"Report Precondition"}
                    onChange={e => this.onChange(e)}
                    value={this.state.additional_precondition}
                    name={"additional_precondition"}
                    validationMsg={this.state.errors.additional_precondition}
                  />
                </div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-title'>Expected Result</div>
                <div className='report-details-row-half-value'>{report.testcase.expected_result}</div>
              </div>
              <div className={`report-details-row-half ${statusValueClass}`}>
                <div className='report-details-row-half-value'>
                  <Input
                    placeholder={"Actual Result"}
                    onChange={e => this.onChange(e)}
                    name={"actual_result"}
                    value={this.state.actual_result}
                    validationMsg={this.state.errors.actual_result}
                  />
                </div>
              </div>
            </div>

            <div className='report-details-row'>
              <div className='report-details-row-full'>
                <div className='report-details-row-full-title'>Description</div>
                <div className='report-details-row-full-value'>{report.testcase.description}</div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className='report-details-row-full'>
                <div className='report-details-row-full-title'>Groups</div>
                <div className='report-details-row-full-value'>
                  {report.testcase.groups.map((group, groupIndex) => (
                    <React.Fragment key={groupIndex}>
                      <Tag title={group.title} color={group.color.title} isRemovable={false} />
                    </React.Fragment>
                  ))}
                </div>
                <br />
                <br />
                <br />
              </div>
            </div>

            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-title'>Test Steps</div>
                <div className='report-details-row-half-value'>
                  {report.testcase.steps.map((step, index) => (
                    <React.Fragment key={index}>
                      <span key={index}>
                        <div className='steps-class mb-2'>
                          {`${index + 1}. `}
                          {step.value}
                          <br />
                          <i>{!isEmpty(step.expected_result) ? `Expected: ${step.expected_result}` : ""}</i>
                        </div>
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className={`report-details-row-half ${statusValueClass}`}>
                <div className='report-details-row-half-title'>Steps Input Data</div>
                <div className='report-details-row-half-value'>
                  {report.testcase.steps.map((step, index) => (
                    <div key={index} className='steps-class'>
                      <span>
                        <Input
                          placeholder={`${index + 1}. Input Data`}
                          onChange={e => this.onChange(e)}
                          name={`input_data`}
                          id={`${index + 1}`}
                          value={this.state.steps && this.state.steps[index] && this.state.steps[index].value}
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
                  {report.testcase.links.map((link, index) => (
                    <div key={index}>
                      <span>
                        {`${index + 1}. `}
                        <a href={link.value} target='_blank' rel='noopener noreferrer'>
                          <span className='mr-1'>{!isEmpty(link.title) ? link.title : link.value}</span>
                          <img className='testcase-details-item--value-img' src={openExternalBtn} alt='External link' />
                        </a>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`report-details-row-half ${statusValueClass}`}>
                <div className='report-details-row-half-title'>Links</div>
                <div className='report-details-row-half-value'>
                  <InputGroupDouble
                    type='text'
                    placeholder={["Enter Link Here", "Enter Link Title Here"]}
                    label='Links'
                    validationMsg={this.state.errors.links}
                    values={this.state.reportLinks}
                    onChange={e => this.onChange(e)}
                    keys={["value", "title"]}
                    id={["value", "title"]}
                    addColumn={<FullBtn placeholder='Add links' onClick={e => this.addColumnLink(e)} />}
                    removeColumn={e => this.removeColumnLink(e)}
                    required={false}
                    onKeyDown={this.submitFormOnEnterKey}
                  />
                </div>
              </div>
            </div>

            {deviceComponent}
            {browserComponent}
            {versionComponent}
            {operatingSystemComponent}
            {environmentComponent}
            {simulatorComponent}
            <div className='report-details-row'>
              <div className={`report-details-row-full ${statusValueClass}`}>
                <div className='report-details-row-full-title'>Comment</div>
                <div className='report-details-row-full-value'>
                  <Input
                    placeholder={"Comment"}
                    onChange={e => this.onChange(e)}
                    name={"comment"}
                    value={this.state.comment}
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
                      label='Save And Open Report'
                      type='text'
                      tooltip={"Save and open report you are about to create"}
                      tooltipId={"saveAndOpenReport"}
                      onClick={e => this.submitForm(e, false)}
                    />
                    <Btn
                      className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2 mb-1 ml-2`}
                      label='Save And Open Test Case'
                      type='text'
                      tooltip={"Save and open test case that this report is created for"}
                      tooltipId={"saveAndOpenTC"}
                      onClick={e => this.submitForm(e, true)}
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
            link={`/${this.props.match.params.projectId}/Reports`}
            canGoBack={true}
          />
          {content}
        </div>
      </div>
    );
  }
}
NewReport.propTypes = {
  reports: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  reports: state.reports,
  report_filters: state.filters,
  auth: state.auth
});

export default connect(mapStateToProps, {
  clearReport,
  getReportFilters,
  getReport,
  createReport
})(withRouter(NewReport));
