import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createSelector } from "reselect";

import GlobalPanel from "../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../components/project-panel/ProjectPanel";
import FilterBtn from "../../../components/common/FilterBtn";
import Header from "../../../components/common/Header";
import SearchBtn from "../../../components/common/SearchBtn";
import ReportCointainer from "../../../components/reports/ReportCointainer";
import {
  getReportSettings,
  editReportSettings,
  getTestcaseSettings,
  clearReportSettings
} from "../../../actions/settingsActions";

import { getReportFilters } from "../../../actions/filterActions";
import { writePermissions, projectIdAndSuperAdminPermission } from "../../../permissions/Permissions";
import { getReports } from "../../../actions/reportActions";
import getidsFromObjectArray from "../../../utility/getIdsFromObjArray";

import SearchDropdown from "../../../components/common/SearchDropdown";
import Datepicker from "../../../components/common/Datepicker";
import isEmpty from "../../../validation/isEmpty";
import Tag from "../../../components/common/Tag";
import moment from "moment";

const WAIT_INTERVAL = 500;
const ENTER_KEY = 13;
class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: false,
      value: null,
      user: this.props.auth.user,
      selectedUsers: [],
      users: [],
      usersWithTestcases: [],
      projectGroups: [],
      projectDevices: [],
      projectEnvironments: [],
      projectBrowsers: [],
      projectVersions: [],
      projectSimulators: [],
      projectOperatingsystems: [],
      statuses: [],
      showDatepickerFrom: false,
      activeDateFrom: "",
      isValidWrite: false,
      showDatepickerTo: false,
      activeDateTo: "",
      testcaseFilters: {},
      searchTerm: "",
      settings: this.props.settings.report_settings,
      selectedGroups: [],
      listViewActivity: "",
      initialLoad: false,
      disabledAlready: false,
      width: 0,
      height: 0
    };
    this.filterBtn = this.filterBtn.bind(this);
    this.selectMultipleOptionGroups = this.selectMultipleOptionGroups.bind(this);
    this.selectMultipleOptionStatuses = this.selectMultipleOptionStatuses.bind(this);
    this.selectMultipleOptionDevices = this.selectMultipleOptionDevices.bind(this);
    this.selectMultipleOptionUsers = this.selectMultipleOptionUsers.bind(this);
    this.selectMultipleOptionEnvironments = this.selectMultipleOptionEnvironments.bind(this);
    this.selectMultipleOptionVersions = this.selectMultipleOptionVersions.bind(this);
    this.selectMultipleOptionBrowsers = this.selectMultipleOptionBrowsers.bind(this);
    this.selectMultipleOptionSimulators = this.selectMultipleOptionSimulators.bind(this);
    this.selectMultipleOptionOss = this.selectMultipleOptionOss.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    if (nextProps.auth && nextProps.auth.user) {
      var { isValid } = projectIdAndSuperAdminPermission(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );
      if (!isValid) {
        nextProps.history.push(`/Projects`);
      }
      update.isValid = isValid;
      var isValidWrite = writePermissions(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );

      var usersWithTestcases = [];
      if (
        nextProps.report_filters &&
        nextProps.report_filters.report_filters &&
        nextProps.report_filters.report_filters.users
      ) {
        nextProps.report_filters.report_filters.users.map(function(item) {
          return usersWithTestcases.push({ id: item.id, title: `${item.first_name} ${item.last_name}` });
        });
        update.usersWithTestcases = usersWithTestcases;
      }

      if (nextProps.filters && nextProps.filters.searchTerm && !prevState.initialLoad) {
        if (nextProps.filters.searchTerm !== prevState.searchTerm) {
          update.initialLoad = true;
          update.searchTerm = nextProps.filters.searchTerm;
        }
      }
      if (
        nextProps.report_filters &&
        nextProps.report_filters.report_filters &&
        nextProps.report_filters.report_filters.statuses
      ) {
        update.statuses = nextProps.report_filters.report_filters.statuses;
      }

      if (
        nextProps.report_filters &&
        nextProps.report_filters.report_filters &&
        nextProps.report_filters.report_filters.groups
      ) {
        update.projectGroups = nextProps.report_filters.report_filters.groups;
      }
      if (
        nextProps.report_filters &&
        nextProps.report_filters.report_filters &&
        nextProps.report_filters.report_filters.devices
      ) {
        update.projectDevices = nextProps.report_filters.report_filters.devices;
      }

      if (
        nextProps.report_filters &&
        nextProps.report_filters.report_filters &&
        nextProps.report_filters.report_filters.browsers
      ) {
        update.projectBrowsers = nextProps.report_filters.report_filters.browsers;
      }

      if (
        nextProps.report_filters &&
        nextProps.report_filters.report_filters &&
        nextProps.report_filters.report_filters.environments
      ) {
        update.projectEnvironments = nextProps.report_filters.report_filters.environments;
      }
      if (
        nextProps.report_filters &&
        nextProps.report_filters.report_filters &&
        nextProps.report_filters.report_filters.simulators
      ) {
        update.projectSimulators = nextProps.report_filters.report_filters.simulators;
      }
      if (
        nextProps.report_filters &&
        nextProps.report_filters.report_filters &&
        nextProps.report_filters.report_filters.operatingsystems
      ) {
        update.projectOperatingsystems = nextProps.report_filters.report_filters.operatingsystems;
      }

      if (
        nextProps.report_filters &&
        nextProps.report_filters.report_filters &&
        nextProps.report_filters.report_filters.versions
      ) {
        const mappedVersions = nextProps.report_filters.report_filters.versions.map(function(row) {
          return { id: row.id, title: row.version, used: row.used };
        });
        update.projectVersions = mappedVersions;
      }
    }
    update.isValidWrite = isValidWrite.isValid;
    return Object.keys(update).length ? update : null;
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClick, false);
    if (this.state.isValid) {
      var projectId = this.props.match.params.projectId;
      this.props.getReportFilters(projectId);
      this.props.getReportSettings(this.props.match.params.projectId);
      this.updateWindowDimensions();
      window.addEventListener("resize", this.updateWindowDimensions);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick, false);
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight }, () => {
      if (this.state.width <= 1400 && !this.state.disabledAlready) {
        this.disableListView();
      } else if (this.state.width > 1400 && this.state.disabledAlready) {
        this.enableListView();
      }
    });
  }
  timer = null;
  handleChange = e => {
    clearTimeout(this.timer);
    this.setState({ searchTerm: e.target.value });
    this.timer = setTimeout(test => {
      this.triggerChange(test);
    }, WAIT_INTERVAL);
  };

  handleKeyDown = e => {
    if (e.keyCode === ENTER_KEY) {
      clearTimeout(this.timer);
      this.triggerChange(e);
    }
  };

  triggerChange = e => {
    var filters = this.selectedFilters();
    filters.search_term = this.state.searchTerm;
    this.props.getReports(this.props.match.params.projectId, filters);

    this.props.editReportSettings(this.props.match.params.projectId, { search_term: this.state.searchTerm });
  };

  handleClick = e => {
    if (this.node) {
      if (this.node.contains(e.target)) {
        return;
      }
      if (this.node2.contains(e.target)) {
        return;
      }
      this.handleClickOutside();
    }
  };

  handleClickOutside() {
    this.setState({ showDatepickerFrom: false, showDatepickerTo: false });
  }
  selectedFilters() {
    var filters = {};
    if (!isEmpty(this.props.filters)) {
      filters.groups = getidsFromObjectArray(this.props.filters.selectedGroups);
      filters.users = getidsFromObjectArray(this.props.filters.selectedUsers);
      filters.date_from =
        this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
      filters.date_to =
        this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
      filters.search_term = this.state.searchTerm;
      filters.statuses = getidsFromObjectArray(this.props.filters.selectedStatuses);
      filters.devices = getidsFromObjectArray(this.props.filters.selectedDevices);
      filters.simulators = getidsFromObjectArray(this.props.filters.selectedSimulators);
      filters.browsers = getidsFromObjectArray(this.props.filters.selectedBrowsers);
      filters.operating_systems = getidsFromObjectArray(this.props.filters.selectedOperatingsystems);
      filters.environments = getidsFromObjectArray(this.props.filters.selectedEnvironments);
      filters.versions = getidsFromObjectArray(this.props.filters.selectedVersions);
      return filters;
    }
  }
  selectMultipleOptionUsers(value) {
    this.setState({ selectedUsers: value }, () => {
      var filters = this.selectedFilters();
      filters.users = getidsFromObjectArray(this.state.selectedUsers);
      this.props.getReports(this.props.match.params.projectId, filters);
      this.props.editReportSettings(this.props.match.params.projectId, { users: filters.users });
    });
  }

  selectMultipleOptionGroups(value) {
    this.setState({ selectedGroups: value }, () => {
      var filters = this.selectedFilters();
      filters.groups = getidsFromObjectArray(this.state.selectedGroups);
      this.props.getReports(this.props.match.params.projectId, filters);
      this.props.editReportSettings(this.props.match.params.projectId, { groups: filters.groups });
    });
  }
  selectMultipleOptionStatuses(value) {
    this.setState({ selectedStatuses: value }, () => {
      var filters = this.selectedFilters();
      filters.statuses = getidsFromObjectArray(this.state.selectedStatuses);
      this.props.getReports(this.props.match.params.projectId, filters);
      this.props.editReportSettings(this.props.match.params.projectId, { statuses: filters.statuses });
    });
  }

  selectMultipleOptionDevices(value) {
    this.setState({ selectedDevices: value }, () => {
      var filters = this.selectedFilters();
      filters.devices = getidsFromObjectArray(this.state.selectedDevices);
      this.props.getReports(this.props.match.params.projectId, filters);
      this.props.editReportSettings(this.props.match.params.projectId, { devices: filters.devices });
    });
  }
  selectMultipleOptionBrowsers(value) {
    this.setState({ selectedBrowsers: value }, () => {
      var filters = this.selectedFilters();
      filters.browsers = getidsFromObjectArray(this.state.selectedBrowsers);
      this.props.getReports(this.props.match.params.projectId, filters);
      this.props.editReportSettings(this.props.match.params.projectId, { browsers: filters.browsers });
    });
  }

  selectMultipleOptionOss(value) {
    this.setState({ selectedOperatingsystems: value }, () => {
      var filters = this.selectedFilters();
      filters.operating_systems = getidsFromObjectArray(this.state.selectedOperatingsystems);
      this.props.getReports(this.props.match.params.projectId, filters);
      this.props.editReportSettings(this.props.match.params.projectId, { operatingsystems: filters.operating_systems });
    });
  }

  selectMultipleOptionEnvironments(value) {
    this.setState({ selectedEnvironments: value }, () => {
      var filters = this.selectedFilters();
      filters.environments = getidsFromObjectArray(this.state.selectedEnvironments);
      this.props.getReports(this.props.match.params.projectId, filters);
      this.props.editReportSettings(this.props.match.params.projectId, { environments: filters.environments });
    });
  }

  selectMultipleOptionVersions(value) {
    this.setState({ selectedVersions: value }, () => {
      var filters = this.selectedFilters();
      filters.versions = getidsFromObjectArray(this.state.selectedVersions);
      this.props.getReports(this.props.match.params.projectId, filters);
      this.props.editReportSettings(this.props.match.params.projectId, { versions: filters.versions });
    });
  }
  selectMultipleOptionSimulators(value) {
    this.setState({ selectedSimulators: value }, () => {
      var filters = this.selectedFilters();
      filters.simulators = getidsFromObjectArray(this.state.selectedSimulators);
      this.props.getReports(this.props.match.params.projectId, filters);
      this.props.editReportSettings(this.props.match.params.projectId, { simulators: filters.simulators });
    });
  }

  removeSearchTerm() {
    this.props.getReports(this.props.match.params.projectId);
    var filters = this.selectedFilters();
    filters.search_term = null;
    this.props.editReportSettings(this.props.match.params.projectId, filters);
    this.setState({ searchTerm: "" });
  }
  removeGroupFilter(e) {
    var filters = this.selectedFilters();
    var groups = this.props.filters.selectedGroups.filter(function(item) {
      return item["id"] !== e;
    });
    filters.groups = getidsFromObjectArray(groups);
    this.props.getReports(this.props.match.params.projectId, filters);

    this.setState({ selectedGroups: groups }, () => {
      this.props.editReportSettings(this.props.match.params.projectId, filters);
    });
  }
  removeUser(e) {
    var filters = this.selectedFilters();
    var selectedUsers = this.state.selectedUsers.filter(function(item) {
      return item["id"] !== e;
    });
    filters.users = getidsFromObjectArray(selectedUsers);
    this.props.getReports(this.props.match.params.projectId, filters);

    this.setState({ selectedUsers }, () => {
      this.props.editReportSettings(this.props.match.params.projectId, filters);
    });
  }

  removeDevice(e) {
    var filters = this.selectedFilters();
    var selectedDevices = this.props.filters.selectedDevices.filter(function(item) {
      return item["id"] !== e;
    });
    filters.devices = getidsFromObjectArray(selectedDevices);
    this.props.getReports(this.props.match.params.projectId, filters);

    this.setState({ selectedDevices }, () => {
      this.props.editReportSettings(this.props.match.params.projectId, filters);
    });
  }

  removeBrowser(e) {
    var filters = this.selectedFilters();
    var selectedBrowsers = this.props.filters.selectedBrowsers.filter(function(item) {
      return item["id"] !== e;
    });
    filters.browsers = getidsFromObjectArray(selectedBrowsers);
    this.props.getReports(this.props.match.params.projectId, filters);

    this.setState({ selectedBrowsers }, () => {
      this.props.editReportSettings(this.props.match.params.projectId, filters);
    });
  }

  removeEnvironment(e) {
    var filters = this.selectedFilters();
    var selectedEnvironments = this.props.filters.selectedEnvironments.filter(function(item) {
      return item["id"] !== e;
    });
    filters.environments = getidsFromObjectArray(selectedEnvironments);
    this.props.getReports(this.props.match.params.projectId, filters);

    this.setState({ selectedEnvironments }, () => {
      this.props.editReportSettings(this.props.match.params.projectId, filters);
    });
  }

  removeOs(e) {
    var filters = this.selectedFilters();
    var selectedOperatingsystems = this.props.filters.selectedOperatingsystems.filter(function(item) {
      return item["id"] !== e;
    });
    filters.operatingsystems = getidsFromObjectArray(selectedOperatingsystems);
    this.props.getReports(this.props.match.params.projectId, filters);

    this.setState({ selectedOperatingsystems }, () => {
      this.props.editReportSettings(this.props.match.params.projectId, filters);
    });
  }
  removeVersion(e) {
    var filters = this.selectedFilters();
    var selectedVersions = this.props.filters.selectedVersions.filter(function(item) {
      return item["id"] !== e;
    });
    filters.versions = getidsFromObjectArray(selectedVersions);
    this.props.getReports(this.props.match.params.projectId, filters);

    this.setState({ selectedVersions }, () => {
      this.props.editReportSettings(this.props.match.params.projectId, filters);
    });
  }

  removeStatus(e) {
    var filters = this.selectedFilters();
    var selectedStatuses = this.props.filters.selectedStatuses.filter(function(item) {
      return item["id"] !== e;
    });
    filters.statuses = getidsFromObjectArray(selectedStatuses);
    this.props.getReports(this.props.match.params.projectId, filters);

    this.setState({ selectedStatuses }, () => {
      this.props.editReportSettings(this.props.match.params.projectId, filters);
    });
  }

  removeSimulator(e) {
    var filters = this.selectedFilters();
    var selectedSimulators = this.props.filters.selectedSimulators.filter(function(item) {
      return item["id"] !== e;
    });
    filters.simulators = getidsFromObjectArray(selectedSimulators);
    this.props.getReports(this.props.match.params.projectId, filters);

    this.setState({ selectedSimulators }, () => {
      this.props.editReportSettings(this.props.match.params.projectId, filters);
    });
  }

  removeFromDate() {
    var filters = this.selectedFilters();
    filters.date_from = null;
    this.props.getReports(this.props.match.params.projectId, filters);
    this.props.editReportSettings(this.props.match.params.projectId, filters);
  }
  setFromDate(day) {
    var filters = this.selectedFilters();
    filters.date_from = moment(day).format("YYYY-MM-DD");
    this.props.getReports(this.props.match.params.projectId, filters);
  }
  setToDate(day) {
    var filters = this.selectedFilters();
    filters.date_to = moment(day).format("YYYY-MM-DD");
    this.props.getReports(this.props.match.params.projectId, filters);
  }

  removeToDate() {
    var filters = this.selectedFilters();
    filters.date_to = null;

    this.props.getReports(this.props.match.params.projectId, filters);
    this.props.editReportSettings(this.props.match.params.projectId, filters);
  }

  filterBtn() {
    var showFilters = !this.props.filters.showFilters;
    var filters = {};
    filters.show_filters = showFilters;

    this.props.editReportSettings(this.props.match.params.projectId, filters);
  }
  resetFilters() {
    var filters = {};
    filters.date_to = null;
    filters.date_from = null;
    filters.search_term = "";
    filters.users = [];
    filters.groups = [];
    filters.statuses = [];
    filters.devices = [];
    filters.simulators = [];
    filters.browsers = [];
    filters.operatingsystems = [];
    filters.environments = [];
    filters.versions = [];
    this.setState({ searchTerm: "" });
    this.props.getReports(this.props.match.params.projectId, filters);
    this.props.editReportSettings(this.props.match.params.projectId, filters);
  }

  setViewList(e) {
    var view_mode = 2;
    this.props.editReportSettings(this.props.match.params.projectId, { view_mode });
  }

  setViewGrid(e) {
    var view_mode = 1;
    this.props.editReportSettings(this.props.match.params.projectId, { view_mode });
  }
  disableListView() {
    var view_mode = 1;

    this.props.editReportSettings(this.props.match.params.projectId, { view_mode });
    this.setState({ listViewActivity: "disabled", disabledAlready: true });
  }
  enableListView() {
    this.setState({ listViewActivity: "", disabledAlready: false });
  }

  render() {
    var view_mode;
    var viewOptionGridClass = "";
    var viewOptionListClass = "";
    if (this.props.filters.viewMode) {
      view_mode = this.props.filters.viewMode;

      if (view_mode === 1) {
        viewOptionGridClass = "activeView";
        viewOptionListClass = "";
      } else if (view_mode === 2) {
        viewOptionGridClass = "";
        viewOptionListClass = "activeView";
      }
    }
    var searchTerm = "";
    if (!isEmpty(this.props.filters.searchTerm)) {
      searchTerm = (
        <Tag
          title={`Search: ${this.props.filters.searchTerm}`}
          color={"SEARCH_COLOR"}
          isRemovable={true}
          onClickRemove={e => this.removeSearchTerm(e)}
        />
      );
    }

    var fromDate = "";
    if (!isEmpty(this.props.filters.selectedDateFrom)) {
      fromDate = (
        <Tag
          title={`From: ${this.props.filters.selectedDateFrom}`}
          color={"DATE_COLOR"}
          isRemovable={true}
          onClickRemove={e => this.removeFromDate(e)}
        />
      );
    }
    var toDate = "";
    if (!isEmpty(this.props.filters.selectedDateTo)) {
      toDate = (
        <Tag
          title={`To: ${this.props.filters.selectedDateTo}`}
          color={"DATE_COLOR"}
          isRemovable={true}
          onClickRemove={e => this.removeToDate(e)}
        />
      );
    }

    var resetFiltersTag = "";
    if (
      !isEmpty(this.props.filters.selectedStatuses) ||
      !isEmpty(this.props.filters.selectedDevices) ||
      !isEmpty(this.props.filters.selectedSimulators) ||
      !isEmpty(this.props.filters.selectedBrowsers) ||
      !isEmpty(this.props.filters.selectedOperatingsystems) ||
      !isEmpty(this.props.filters.selectedEnvironments) ||
      !isEmpty(this.props.filters.selectedVersions) ||
      !isEmpty(this.props.filters.selectedUsers) ||
      !isEmpty(this.props.filters.selectedGroups) ||
      this.props.filters.selectedDateTimestampFrom !== "" ||
      this.props.filters.selectedDateTimestampTo !== "" ||
      !isEmpty(this.props.filters.searchTerm)
    ) {
      resetFiltersTag = (
        <Tag title={"Reset all"} color={"RESET_COLOR"} isRemovable={true} onClickRemove={e => this.resetFilters()} />
      );
    }
    var filters = <div className='padding'></div>;
    if (this.props.filters.showFilters) {
      filters = (
        <div>
          <div className='testcase-grid'>
            <Datepicker
              forwardRef={node => (this.node = node)}
              showdatepicker={this.state.showDatepickerFrom}
              placeholder={"From Date"}
              label={"Select Date"}
              selectedDate={this.props.filters.selectedDateFrom}
              onClick={e => this.setState({ showDatepickerFrom: !this.state.showDatepickerFrom })}
              onChange={e => this.setState({ showDatepickerFrom: !this.state.showDatepickerFrom })}
              active={this.state.activeDateFrom ? this.state.activeDateFrom !== null : ""}
              timestamp={this.props.filters.selectedDateTimestampFrom}
              onDayClick={day => {
                this.setFromDate(day);
                this.props.editReportSettings(this.props.match.params.projectId, {
                  date_from: moment(day).format("YYYY-MM-DD")
                });
              }}
            />
            <Datepicker
              forwardRef={node2 => (this.node2 = node2)}
              showdatepicker={this.state.showDatepickerTo}
              placeholder={"To Date"}
              label={"Select Date"}
              selectedDate={this.props.filters.selectedDateTo}
              onClick={e => this.setState({ showDatepickerTo: !this.state.showDatepickerTo })}
              onChange={e => this.setState({ showDatepickerTo: !this.state.showDatepickerTo })}
              active={this.state.activeDateTo ? this.state.activeDateTo !== null : ""}
              timestamp={this.props.filters.selectedDateTimestampTo}
              onDayClick={day => {
                this.setToDate(day);
                this.props.editReportSettings(this.props.match.params.projectId, {
                  date_to: moment(day).format("YYYY-MM-DD")
                });
              }}
            />
            <SearchDropdown
              value={this.props.filters.selectedStatuses}
              options={this.state.statuses}
              onChange={this.selectMultipleOptionStatuses}
              label={"Status"}
              placeholder={"Statuses"}
              multiple={true}
            />
            <SearchDropdown
              value={this.props.filters.selectedGroups}
              options={this.state.projectGroups}
              onChange={this.selectMultipleOptionGroups}
              label={"Test Groups"}
              placeholder={"Groups"}
              multiple={true}
            />

            <SearchDropdown
              value={this.props.filters.selectedUsers}
              options={this.state.usersWithTestcases}
              onChange={this.selectMultipleOptionUsers}
              label={"Select User"}
              placeholder={"Users"}
              multiple={true}
              numberDisplayed={1}
            />

            <SearchDropdown
              value={this.props.filters.selectedDevices}
              options={this.state.projectDevices}
              onChange={this.selectMultipleOptionDevices}
              label={"Device"}
              placeholder={"Devices"}
              multiple={true}
            />
            <SearchDropdown
              value={this.props.filters.selectedBrowsers}
              options={this.state.projectBrowsers}
              onChange={this.selectMultipleOptionBrowsers}
              label={"Browser"}
              placeholder={"Browsers"}
              multiple={true}
            />
            <SearchDropdown
              value={this.props.filters.selectedOperatingsystems}
              options={this.state.projectOperatingsystems}
              onChange={this.selectMultipleOptionOss}
              label={"Operating System"}
              placeholder={"Operating Systems"}
              multiple={true}
            />
            <SearchDropdown
              value={this.props.filters.selectedEnvironments}
              options={this.state.projectEnvironments}
              onChange={this.selectMultipleOptionEnvironments}
              label={"Environment"}
              placeholder={"Environments"}
              multiple={true}
            />
            <SearchDropdown
              value={this.props.filters.selectedVersions}
              options={this.state.projectVersions}
              onChange={this.selectMultipleOptionVersions}
              label={"Version"}
              placeholder={"Versions"}
              multiple={true}
            />
            <SearchDropdown
              value={this.props.filters.selectedSimulators}
              options={this.state.projectSimulators}
              onChange={this.selectMultipleOptionSimulators}
              label={"Simulators"}
              placeholder={"Simulators"}
              multiple={true}
            />
          </div>

          <div className='active-filter-container'>
            {this.props.filters.selectedGroups &&
              this.props.filters.selectedGroups.map((group, index) => (
                <Tag
                  key={index}
                  title={group.title}
                  color={group.color}
                  isRemovable={true}
                  onClickRemove={e => this.removeGroupFilter(group.id)}
                />
              ))}
            {this.props.filters.selectedUsers &&
              this.props.filters.selectedUsers.map((user, index) => (
                <Tag
                  key={index}
                  title={user.title}
                  color={"USER_COLOR"}
                  isRemovable={true}
                  onClickRemove={e => this.removeUser(user.id)}
                />
              ))}
            {this.props.filters.selectedDevices &&
              this.props.filters.selectedDevices.map((device, index) => (
                <Tag
                  key={index}
                  title={device.title}
                  color={"SETUP_COLOR"}
                  isRemovable={true}
                  onClickRemove={e => this.removeDevice(device.id)}
                />
              ))}
            {this.props.filters.selectedBrowsers &&
              this.props.filters.selectedBrowsers.map((browser, index) => (
                <Tag
                  key={index}
                  title={browser.title}
                  color={"SETUP_COLOR"}
                  isRemovable={true}
                  onClickRemove={e => this.removeBrowser(browser.id)}
                />
              ))}
            {this.props.filters.selectedOperatingsystems &&
              this.props.filters.selectedOperatingsystems.map((os, index) => (
                <Tag
                  key={index}
                  title={os.title}
                  color={"SETUP_COLOR"}
                  isRemovable={true}
                  onClickRemove={e => this.removeOs(os.id)}
                />
              ))}
            {this.props.filters.selectedEnvironments &&
              this.props.filters.selectedEnvironments.map((environment, index) => (
                <Tag
                  key={index}
                  title={environment.title}
                  color={"SETUP_COLOR"}
                  isRemovable={true}
                  onClickRemove={e => this.removeEnvironment(environment.id)}
                />
              ))}
            {this.props.filters.selectedVersions &&
              this.props.filters.selectedVersions.map((version, index) => (
                <Tag
                  key={index}
                  title={version.title}
                  color={"SETUP_COLOR"}
                  isRemovable={true}
                  onClickRemove={e => this.removeVersion(version.id)}
                />
              ))}
            {this.props.filters.selectedStatuses &&
              this.props.filters.selectedStatuses.map((status, index) => (
                <Tag
                  key={index}
                  title={status.title}
                  color={"SETUP_COLOR"}
                  isRemovable={true}
                  onClickRemove={e => this.removeStatus(status.id)}
                />
              ))}
            {this.props.filters.selectedSimulators &&
              this.props.filters.selectedSimulators.map((simulator, index) => (
                <Tag
                  key={index}
                  title={simulator.title}
                  color={"SETUP_COLOR"}
                  isRemovable={true}
                  onClickRemove={e => this.removeSimulator(simulator.id)}
                />
              ))}
            {fromDate}
            {toDate}
            {searchTerm}
            {resetFiltersTag}
          </div>
        </div>
      );
    }

    if (!this.state.listViewActivity) {
      var listView = (
        <div className='view-options'>
          <div
            className={`view-options--list ${this.state.listViewActivity} clickable ${viewOptionListClass}`}
            onClick={e => this.setViewList(e)}
          >
            <i className='fas fa-bars '></i>
          </div>
          <div className={`view-options--grid clickable ${viewOptionGridClass}`} onClick={e => this.setViewGrid(e)}>
            <i className='fas fa-th '></i>
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
            icon={<i className='fas fa-file-alt'></i>}
            title={"Reports"}
            canGoBack={false}
            filterBtn={
              <FilterBtn
                onClick={this.filterBtn}
                activeFilters={this.props.filters.activeFilters}
                filtersShown={this.props.filters.showFilters}
              />
            }
            searchBtn={
              <SearchBtn
                name={"search"}
                searchActive={this.props.filters.searchTerm}
                value={this.state.searchTerm}
                onChange={e => this.handleChange(e)}
                onKeyDown={this.handleKeyDown}
              />
            }
          />

          {listView}
          {filters}
          <ReportCointainer filters={this.state.testcaseFilters} viewOption={view_mode} />
        </div>
      </div>
    );
  }
}

Reports.propTypes = {
  testcases: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases,
  filters: filterSelector(state),
  report_filters: state.filters,
  settings: state.settings,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getReportSettings,
  getReportFilters,
  getTestcaseSettings,
  editReportSettings,
  getReports,
  clearReportSettings
})(withRouter(Reports));

const getSettings = state => state.settings.report_settings;
const getReportFilterProps = state => state.filters.report_filters;

const filterSelector = createSelector([getSettings, getReportFilterProps], (report_settings, report_filters) => {
  var dateFrom = "";
  var selectedDateTimestampFrom = "";
  var selectedDateFrom = "";
  var selectedDateFromFormated = "";

  var dateTo = "";
  var selectedDateTimestampTo = "";
  var selectedDateTo = "";
  var selectedDateToFormated = "";

  var viewMode = 1;
  var showFilters = true;
  var searchTerm = "";
  var selectedUsers = [];
  var selectedDevices = [];
  var selectedBrowsers = [];
  var selectedOperatingsystems = [];
  var selectedEnvironments = [];
  var selectedGroups = [];
  var selectedSimulators = [];
  var selectedVersions = [];
  var selectedStatuses = [];

  var activeFilters = false;

  if (report_settings && report_filters) {
    if (report_filters.devices) {
      selectedDevices = [];
      report_filters.devices.map(function(item) {
        if (report_settings && report_settings.devices) {
          if (report_settings.devices.includes(item.id)) {
            selectedDevices.push({ id: item.id, title: item.title });
          }
        }
        return selectedDevices;
      });
    }

    if (report_filters.browsers) {
      selectedBrowsers = [];
      report_filters.browsers.map(function(item) {
        if (report_settings && report_settings.browsers) {
          if (report_settings.browsers.includes(item.id)) {
            selectedBrowsers.push({ id: item.id, title: item.title });
          }
        }
        return selectedBrowsers;
      });
    }

    if (report_filters.environments) {
      selectedEnvironments = [];
      report_filters.environments.map(function(item) {
        if (report_settings && report_settings.environments) {
          if (report_settings.environments.includes(item.id)) {
            selectedEnvironments.push({ id: item.id, title: item.title });
          }
        }
        return selectedEnvironments;
      });
    }

    if (report_filters.simulators) {
      selectedSimulators = [];
      report_filters.simulators.map(function(item) {
        if (report_settings && report_settings.simulators) {
          if (report_settings.simulators.includes(item.id)) {
            selectedSimulators.push({ id: item.id, title: item.title });
          }
        }
        return selectedSimulators;
      });
    }

    if (report_filters.statuses) {
      selectedStatuses = [];
      report_filters.statuses.map(function(item) {
        if (report_settings && report_settings.statuses) {
          if (report_settings.statuses.includes(item.id)) {
            selectedStatuses.push({ id: item.id, title: item.title });
          }
        }
        return selectedStatuses;
      });
    }

    if (report_filters.versions) {
      selectedVersions = [];
      report_filters.versions.map(function(item) {
        if (report_settings && report_settings.versions) {
          if (report_settings.versions.includes(item.id)) {
            selectedVersions.push({ id: item.id, title: item.version });
          }
        }
        return selectedVersions;
      });
    }

    if (report_filters.operatingsystems) {
      selectedOperatingsystems = [];
      report_filters.operatingsystems.map(function(item) {
        if (report_settings && report_settings.operatingsystems) {
          if (report_settings.operatingsystems.includes(item.id)) {
            selectedOperatingsystems.push({ id: item.id, title: item.title });
          }
        }
        return selectedOperatingsystems;
      });
    }
    if (report_filters.users) {
      var selectedUsersObjects = [];
      report_filters.users.map(function(item) {
        if (report_settings && report_settings.users) {
          if (report_settings.users.includes(item.id)) {
            selectedUsersObjects.push({ id: item.id, title: `${item.first_name} ${item.last_name}` });
          }
        }
        return selectedUsersObjects;
      });
      selectedUsers = selectedUsersObjects;
    }

    if (report_filters.groups) {
      selectedGroups = [];
      report_filters.groups.map(function(item) {
        if (report_settings && report_settings.groups) {
          if (report_settings.groups.includes(item.id)) {
            selectedGroups.push({ id: item.id, title: item.title, color: item.color });
          }
        }
        return selectedGroups;
      });
    }

    if (report_settings.date_from) {
      dateFrom = report_settings.date_from;
      selectedDateTimestampFrom = moment(report_settings.date_from)._d;
      selectedDateFrom = moment(report_settings.date_from).format(" Do MMM YY");
      selectedDateFromFormated = moment(report_settings.date_from).format("YYYY-MM-DD");
    }
    if (report_settings.date_to) {
      dateTo = report_settings.date_to;
      selectedDateTimestampTo = moment(report_settings.date_to)._d;
      selectedDateTo = moment(report_settings.date_to).format(" Do MMM YY");
      selectedDateToFormated = moment(report_settings.date_to).format("YYYY-MM-DD");
    }
    if (report_settings.view_mode) {
      viewMode = report_settings.view_mode;
    }
    showFilters = report_settings.show_filters;
    if (report_settings.search_term !== null) {
      searchTerm = report_settings.search_term;
    }

    if (
      !isEmpty(selectedUsers) ||
      !isEmpty(selectedGroups) ||
      selectedDateTimestampFrom !== "" ||
      selectedDateTimestampTo !== "" ||
      !isEmpty(selectedStatuses) ||
      !isEmpty(selectedDevices) ||
      !isEmpty(selectedSimulators) ||
      !isEmpty(selectedBrowsers) ||
      !isEmpty(selectedOperatingsystems) ||
      !isEmpty(selectedEnvironments) ||
      !isEmpty(selectedVersions)
    ) {
      activeFilters = true;
    }
    return {
      dateFrom,
      selectedDateTimestampFrom,
      selectedDateFrom,
      dateTo,
      selectedDateTimestampTo,
      selectedDateTo,
      viewMode,
      showFilters,
      searchTerm,
      selectedUsers,
      selectedGroups,
      selectedDevices,
      selectedEnvironments,
      selectedSimulators,
      selectedOperatingsystems,
      selectedVersions,
      selectedStatuses,
      selectedBrowsers,
      activeFilters,
      selectedDateFromFormated,
      selectedDateToFormated
    };
  }
  return {};
});
