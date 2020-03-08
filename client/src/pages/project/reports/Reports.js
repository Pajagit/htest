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
import { getGroups } from "../../../actions/groupsActions";
import { getUsers } from "../../../actions/userActions";
import { getReportSettings, editProjectSettings, clearSettings } from "../../../actions/settingsActions";
import { getStatuses } from "../../../actions/statusActions";
import { getDevices } from "../../../actions/deviceActions";
import { getEnvironments } from "../../../actions/environmentActions";
import { getVersions } from "../../../actions/versionAction";
import { getBrowsers } from "../../../actions/browserActions";
import { getOperatingSystems } from "../../../actions/osActions";
import { writePermissions, projectIdAndSuperAdminPermission } from "../../../permissions/Permissions";
import { getTestcases } from "../../../actions/testcaseActions";
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
      projectOss: [],
      statuses: [],
      showDatepickerFrom: false,
      activeDateFrom: "",
      isValidWrite: false,
      showDatepickerTo: false,
      activeDateTo: "",
      testcaseFilters: {},
      searchTerm: "",
      settings: this.props.settings.report_settings,
      selectedGroupFilters: [],
      listViewActivity: "",
      disabledAlready: false,
      width: 0,
      height: 0
    };
    this.filterBtn = this.filterBtn.bind(this);
    this.selectMultipleOptionGroups = this.selectMultipleOptionGroups.bind(this);
    this.selectMultipleOptionUsers = this.selectMultipleOptionUsers.bind(this);
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
      if (nextProps.users && nextProps.users.users) {
        if (nextProps.users.users !== prevState.users) {
          nextProps.users.users.map(function(item) {
            return usersWithTestcases.push({ id: item.id, title: `${item.first_name} ${item.last_name}` });
          });
          update.usersWithTestcases = usersWithTestcases;
        }
      }

      if (nextProps.statuses && nextProps.statuses.statuses) {
        update.statuses = nextProps.statuses.statuses;
      }
      if (nextProps.groups && nextProps.groups.groups) {
        update.projectGroups = nextProps.groups.groups;
      }
      if (nextProps.devices && nextProps.devices.devices) {
        update.projectDevices = nextProps.devices.devices.devices;
      }
      if (nextProps.browsers && nextProps.browsers.browsers) {
        update.projectBrowsers = nextProps.browsers.browsers.browsers;
      }
      if (nextProps.oss && nextProps.oss.oss) {
        update.projectOss = nextProps.oss.oss.oss;
      }
      if (nextProps.environments && nextProps.environments.environments) {
        update.projectEnvironments = nextProps.environments.environments.environments;
      }
      if (nextProps.versions && nextProps.versions.versions) {
        const mappedVersions = nextProps.versions.versions.versions.map(function(row) {
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
      this.props.getGroups(projectId);
      this.props.getBrowsers(projectId);
      this.props.getOperatingSystems(projectId);
      this.props.getStatuses();
      this.props.getEnvironments(projectId);
      this.props.getVersions(projectId);
      this.props.getDevices(null, projectId);
      var has_testcases = true;
      this.props.getUsers(has_testcases, projectId);
      this.props.getReportSettings(this.props.match.params.projectId);

      this.updateWindowDimensions();
      window.addEventListener("resize", this.updateWindowDimensions);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick, false);
    window.removeEventListener("resize", this.updateWindowDimensions);
    this.props.clearSettings();
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
    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroupFilters);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.date_from =
      this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
    testcase.date_to =
      this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
    testcase.search_term = this.state.searchTerm;
    this.props.getTestcases(this.props.match.params.projectId, testcase);

    this.props.editProjectSettings(this.props.match.params.projectId, { search_term: this.state.searchTerm });
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

  selectMultipleOptionUsers(value) {
    this.setState({ selectedUsers: value }, () => {
      var testcase = {};
      testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroupFilters);
      testcase.users = getidsFromObjectArray(this.state.selectedUsers);
      testcase.date_from = this.props.filters.selectedDateFromFormated;
      testcase.date_to = this.props.filters.selectedDateToFormated;
      testcase.search_term = this.state.searchTerm;
      this.props.getTestcases(this.props.match.params.projectId, testcase);
      this.props.editProjectSettings(this.props.match.params.projectId, { users: testcase.users });
    });
  }

  selectMultipleOptionGroups(value) {
    this.setState({ selectedGroupFilters: value }, () => {
      var testcase = {};
      testcase.groups = getidsFromObjectArray(this.state.selectedGroupFilters);
      testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
      testcase.date_from =
        this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
      testcase.date_to =
        this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
      testcase.search_term = this.state.searchTerm;
      this.props.getTestcases(this.props.match.params.projectId, testcase);
      this.props.editProjectSettings(this.props.match.params.projectId, { groups: testcase.groups });
    });
  }

  removeSearchTerm() {
    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroupFilters);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.date_from =
      this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
    testcase.date_to =
      this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
    testcase.search_term = "";
    this.props.getTestcases(this.props.match.params.projectId, testcase);

    this.props.editProjectSettings(this.props.match.params.projectId, { search_term: null });
    this.setState({ searchTerm: "" });
  }
  removeGroupFilter(e) {
    var groups = this.props.filters.selectedGroupFilters.filter(function(item) {
      return item["id"] !== e;
    });

    var testcase = {};
    testcase.groups = getidsFromObjectArray(groups);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.date_from =
      this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
    testcase.date_to =
      this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
    testcase.search_term = this.state.searchTerm;
    this.props.getTestcases(this.props.match.params.projectId, testcase);

    this.setState({ selectedGroupFilters: groups }, () => {
      this.props.editProjectSettings(this.props.match.params.projectId, testcase);
    });
  }
  removeUser(e) {
    var selectedUsers = this.state.selectedUsers.filter(function(item) {
      return item["id"] !== e;
    });

    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroupFilters);
    testcase.users = getidsFromObjectArray(selectedUsers);
    testcase.date_from =
      this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
    testcase.date_to =
      this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
    testcase.search_term = "";
    this.props.getTestcases(this.props.match.params.projectId, testcase);

    this.setState({ selectedUsers }, () => {
      this.props.editProjectSettings(this.props.match.params.projectId, testcase);
    });
  }

  removeFromDate() {
    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroupFilters);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.date_from = null;
    testcase.date_to =
      this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
    testcase.search_term = "";
    this.props.getTestcases(this.props.match.params.projectId, testcase);
    this.props.editProjectSettings(this.props.match.params.projectId, { date_from: null });
  }
  setFromDate(day) {
    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroupFilters);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.date_from = moment(day).format("YYYY-MM-DD HH:mm:ss");
    testcase.date_to =
      this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
    testcase.search_term = this.state.searchTerm;
    this.props.getTestcases(this.props.match.params.projectId, testcase);
  }
  setToDate(day) {
    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroupFilters);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.date_from =
      this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
    testcase.date_to = moment(day).format("YYYY-MM-DD HH:mm:ss");

    testcase.search_term = this.state.searchTerm;
    this.props.getTestcases(this.props.match.params.projectId, testcase);
  }

  removeToDate() {
    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroupFilters);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.date_from =
      this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
    testcase.date_to = null;
    testcase.search_term = "";
    this.props.getTestcases(this.props.match.params.projectId, testcase);
    this.props.editProjectSettings(this.props.match.params.projectId, { date_to: null });
  }

  filterBtn() {
    var showFilters = !this.props.filters.showFilters;
    var testcase = {};
    testcase.show_filters = showFilters;

    this.props.editProjectSettings(this.props.match.params.projectId, testcase);
  }
  resetFilters() {
    var testcase = {};
    testcase.date_to = null;
    testcase.date_from = null;
    testcase.search_term = "";
    testcase.users = [];
    testcase.groups = [];

    this.props.getTestcases(this.props.match.params.projectId, testcase);
    this.props.editProjectSettings(this.props.match.params.projectId, testcase);
  }

  setViewList(e) {
    var view_mode = 2;
    this.props.editProjectSettings(this.props.match.params.projectId, { view_mode });
  }

  setViewGrid(e) {
    var view_mode = 1;
    this.props.editProjectSettings(this.props.match.params.projectId, { view_mode });
  }
  disableListView() {
    var view_mode = 1;
    this.props.editProjectSettings(this.props.match.params.projectId, { view_mode });
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
      !isEmpty(this.props.filters.selectedUsers) ||
      !isEmpty(this.props.filters.selectedGroupFilters) ||
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
            <SearchDropdown
              value={this.props.filters.selectedGroupFilters}
              options={this.state.statuses}
              onChange={this.selectMultipleOptionGroups}
              label={"Status"}
              placeholder={"Statuses"}
              multiple={true}
            />
            <SearchDropdown
              value={this.props.filters.selectedGroupFilters}
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
              numberDisplayed={2}
            />

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
                this.props.editProjectSettings(this.props.match.params.projectId, {
                  date_from: moment(day).format("YYYY-MM-DD HH:mm:ss")
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
                this.props.editProjectSettings(this.props.match.params.projectId, {
                  date_to: moment(day).format("YYYY-MM-DD HH:mm:ss")
                });
              }}
            />
            <SearchDropdown
              value={this.props.filters.selectedGroupFilters}
              options={this.state.projectDevices}
              onChange={this.selectMultipleOptionGroups}
              label={"Device"}
              placeholder={"Devices"}
              multiple={true}
            />
            <SearchDropdown
              value={this.props.filters.selectedGroupFilters}
              options={this.state.projectBrowsers}
              onChange={this.selectMultipleOptionGroups}
              label={"Browser"}
              placeholder={"Browsers"}
              multiple={true}
            />
            <SearchDropdown
              value={this.props.filters.selectedGroupFilters}
              options={this.state.projectOss}
              onChange={this.selectMultipleOptionGroups}
              label={"Operating System"}
              placeholder={"Operating Systems"}
              multiple={true}
            />
            <SearchDropdown
              value={this.props.filters.selectedGroupFilters}
              options={this.state.projectEnvironments}
              onChange={this.selectMultipleOptionGroups}
              label={"Environment"}
              placeholder={"Environments"}
              multiple={true}
            />
            <SearchDropdown
              value={this.props.filters.selectedGroupFilters}
              options={this.state.projectVersions}
              onChange={this.selectMultipleOptionGroups}
              label={"Version"}
              placeholder={"Versions"}
              multiple={true}
            />
          </div>

          <div className='active-filter-container'>
            {this.props.filters.selectedGroupFilters &&
              this.props.filters.selectedGroupFilters.map((group, index) => (
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
                value={this.state.searchTerm !== null ? this.state.searchTerm : this.props.filters.searchTerm}
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
  testcases: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases,
  filters: filterSelector(state),
  groups: state.groups,
  browsers: state.browsers,
  statuses: state.statuses,
  versions: state.versions,
  users: state.users,
  devices: state.devices,
  oss: state.oss,
  environments: state.environments,
  settings: state.settings,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getGroups,
  getUsers,
  getReportSettings,
  getDevices,
  getBrowsers,
  getOperatingSystems,
  getEnvironments,
  getVersions,
  editProjectSettings,
  getTestcases,
  getStatuses,
  clearSettings
})(withRouter(Reports));

const getSettings = state => state.settings.report_settings;
const getUsersProps = state => state.users;
const getGroupsProps = state => state.groups;

const filterSelector = createSelector(
  [getSettings, getUsersProps, getGroupsProps],
  (report_settings, users, groups) => {
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
    var selectedGroupFilters = [];

    var activeFilters = false;

    if (report_settings) {
      if (groups) {
        if (groups.groups) {
          var selectedGroup = [];
          groups.groups.map(function(item) {
            if (report_settings && report_settings.groups) {
              if (report_settings.groups.includes(item.id)) {
                selectedGroup.push({ id: item.id, title: item.title, color: item.color });
              }
            }
            return selectedGroup;
          });
          selectedGroupFilters = selectedGroup;
        }
      }

      if (users) {
        if (users.users) {
          var selectedUsersObjects = [];
          users.users.map(function(item) {
            if (report_settings && report_settings.users) {
              if (report_settings.users.includes(item.id)) {
                selectedUsersObjects.push({ id: item.id, title: `${item.first_name} ${item.last_name}` });
              }
            }
            return selectedUsersObjects;
          });
          selectedUsers = selectedUsersObjects;
        }
      }

      if (report_settings.date_from) {
        dateFrom = report_settings.date_from;
        selectedDateTimestampFrom = moment(report_settings.date_from)._d;
        selectedDateFrom = moment(report_settings.date_from).format(" Do MMM YY");
        selectedDateFromFormated = moment(report_settings.date_from).format("YYYY-MM-DD HH:mm:ss");
      }
      if (report_settings.date_to) {
        dateTo = report_settings.date_to;
        selectedDateTimestampTo = moment(report_settings.date_to)._d;
        selectedDateTo = moment(report_settings.date_to).format(" Do MMM YY");
        selectedDateToFormated = moment(report_settings.date_to)
          .add(21, "hours")
          .add(59, "minutes")
          .add(59, "seconds")
          .format("YYYY-MM-DD HH:mm:ss");
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
        !isEmpty(selectedGroupFilters) ||
        selectedDateTimestampFrom !== "" ||
        selectedDateTimestampTo !== ""
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
        selectedGroupFilters,
        activeFilters,
        selectedDateFromFormated,
        selectedDateToFormated
      };
    }
    return {};
  }
);
