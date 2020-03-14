import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createSelector } from "reselect";

import GlobalPanel from "../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../components/project-panel/ProjectPanel";
import BtnAnchorResponsive from "../../../components/common/BtnAnchorResponsive";
import FilterBtn from "../../../components/common/FilterBtn";
import Header from "../../../components/common/Header";
import SearchBtn from "../../../components/common/SearchBtn";
import TestCaseContainer from "../../../components/test-cases/TestCaseContainer";
import { getTestcaseSettings, editTestcaseSettings, clearTestcaseSettings } from "../../../actions/settingsActions";
import { getTestcaseFilters } from "../../../actions/filterActions";
import { writePermissions } from "../../../permissions/Permissions";
import { projectIdAndSuperAdminPermission } from "../../../permissions/Permissions";
import { getTestcases } from "../../../actions/testcaseActions";
import getidsFromObjectArray from "../../../utility/getIdsFromObjArray";

import SearchDropdown from "../../../components/common/SearchDropdown";
import Datepicker from "../../../components/common/Datepicker";
import isEmpty from "../../../validation/isEmpty";
import Tag from "../../../components/common/Tag";
import moment from "moment";

const WAIT_INTERVAL = 500;
const ENTER_KEY = 13;
class TestCases extends Component {
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
      showDatepickerFrom: false,
      activeDateFrom: "",
      isValidWrite: false,
      showDatepickerTo: false,
      activeDateTo: "",
      testcaseFilters: {},
      searchTerm: "",
      settings: this.props.settings.testcase_settings,
      selectedGroups: [],
      listViewActivity: "",
      disabledAlready: false,
      view_mode: 1,
      width: 0,
      initialLoad: false,
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
      update.isValidWrite = isValidWrite;

      var usersWithTestcases = [];
      if (
        nextProps.testcase_filters &&
        nextProps.testcase_filters.testcase_filters &&
        nextProps.testcase_filters.testcase_filters.users
      ) {
        if (nextProps.testcase_filters.testcase_filters.users !== prevState.users) {
          nextProps.testcase_filters.testcase_filters.users.map(function(item) {
            return usersWithTestcases.push({ id: item.id, title: `${item.first_name} ${item.last_name}` });
          });
          update.usersWithTestcases = usersWithTestcases;
        }
      }
      if (nextProps.filters && nextProps.filters.searchTerm && !prevState.initialLoad) {
        if (nextProps.filters.searchTerm !== prevState.searchTerm) {
          update.initialLoad = true;
          update.searchTerm = nextProps.filters.searchTerm;
        }
      }
      if (
        nextProps.testcase_filters &&
        nextProps.testcase_filters.testcase_filters &&
        nextProps.testcase_filters.testcase_filters.groups
      ) {
        update.projectGroups = nextProps.testcase_filters.testcase_filters.groups;
      }
    }
    update.isValidWrite = isValidWrite.isValid;
    return Object.keys(update).length ? update : null;
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClick, false);
    if (this.state.isValid) {
      var projectId = this.props.match.params.projectId;
      this.props.getTestcaseSettings(projectId);
      this.props.getTestcaseFilters(projectId);

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
    this.setState({ searchTerm: e.target.value }, () => {});
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
    this.props.getTestcases(this.props.match.params.projectId, filters);

    this.props.editTestcaseSettings(this.props.match.params.projectId, { search_term: this.state.searchTerm });
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
      return filters;
    }
  }

  selectMultipleOptionUsers(value) {
    this.setState({ selectedUsers: value }, () => {
      var filters = this.selectedFilters();
      filters.users = getidsFromObjectArray(this.state.selectedUsers);
      this.props.getTestcases(this.props.match.params.projectId, filters);
      this.props.editTestcaseSettings(this.props.match.params.projectId, { users: filters.users });
    });
  }

  selectMultipleOptionGroups(value) {
    this.setState({ selectedGroups: value }, () => {
      var filters = this.selectedFilters();
      filters.groups = getidsFromObjectArray(this.state.selectedGroups);
      this.props.getTestcases(this.props.match.params.projectId, filters);
      this.props.editTestcaseSettings(this.props.match.params.projectId, { groups: filters.groups });
    });
  }

  removeSearchTerm() {
    this.props.editTestcaseSettings(this.props.match.params.projectId, { search_term: null });
    this.setState({ searchTerm: "" }, () => {
      var filters = this.selectedFilters();
      this.props.getTestcases(this.props.match.params.projectId, filters);
    });
  }
  removeGroupFilter(e) {
    var filters = this.selectedFilters();

    var groups = this.props.filters.selectedGroups.filter(function(item) {
      return item["id"] !== e;
    });
    filters.groups = groups;
    this.props.getTestcases(this.props.match.params.projectId, filters);

    this.setState({ selectedGroups: groups }, () => {
      this.props.editTestcaseSettings(this.props.match.params.projectId, filters);
    });
  }
  removeUser(e) {
    var filters = this.selectedFilters();
    var selectedUsers = this.state.selectedUsers.filter(function(item) {
      return item["id"] !== e;
    });
    filters.users = selectedUsers;
    this.props.getTestcases(this.props.match.params.projectId, filters);

    this.setState({ selectedUsers }, () => {
      this.props.editTestcaseSettings(this.props.match.params.projectId, filters);
    });
  }

  removeFromDate() {
    var filters = this.selectedFilters();
    filters.date_from = null;
    this.props.getTestcases(this.props.match.params.projectId, filters);
    this.props.editTestcaseSettings(this.props.match.params.projectId, { date_from: null });
  }
  setFromDate(day) {
    var filters = this.selectedFilters();
    filters.date_from = moment(day).format("YYYY-MM-DD");
    this.props.getTestcases(this.props.match.params.projectId, filters);
  }
  setToDate(day) {
    var filters = this.selectedFilters();
    filters.date_to = moment(day).format("YYYY-MM-DD");
    this.props.getTestcases(this.props.match.params.projectId, filters);
  }

  removeToDate() {
    var filters = this.selectedFilters();
    filters.date_to = null;
    this.props.getTestcases(this.props.match.params.projectId, filters);
    this.props.editTestcaseSettings(this.props.match.params.projectId, { date_to: null });
  }

  filterBtn() {
    var showFilters = !this.props.filters.showFilters;
    var filters = {};
    filters.show_filters = showFilters;

    this.props.editTestcaseSettings(this.props.match.params.projectId, filters);
  }
  resetFilters() {
    var filters = {};
    filters.date_to = null;
    filters.date_from = null;
    filters.search_term = "";
    filters.users = [];
    filters.groups = [];

    this.props.getTestcases(this.props.match.params.projectId, filters);
    this.props.editTestcaseSettings(this.props.match.params.projectId, filters);
  }

  setViewList(e) {
    var view_mode = 2;
    this.props.editTestcaseSettings(this.props.match.params.projectId, { view_mode });
  }

  setViewGrid(e) {
    var view_mode = 1;
    this.props.editTestcaseSettings(this.props.match.params.projectId, { view_mode });
  }
  disableListView() {
    var view_mode = 1;
    this.props.editTestcaseSettings(this.props.match.params.projectId, { view_mode });

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
                this.props.editTestcaseSettings(this.props.match.params.projectId, {
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
                this.props.editTestcaseSettings(this.props.match.params.projectId, {
                  date_to: moment(day).format("YYYY-MM-DD")
                });
              }}
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
              numberDisplayed={2}
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
            {fromDate}
            {toDate}
            {searchTerm}
            {resetFiltersTag}
          </div>
        </div>
      );
    }
    var addTestCase = "";
    if (this.state.isValidWrite) {
      addTestCase = (
        <BtnAnchorResponsive
          type={"text"}
          label='Add New'
          className={"a-btn-responsive a-btn-primary"}
          link={`/${this.props.match.params.projectId}/CreateTestCase`}
        />
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
            icon={<i className='fas fa-clipboard-list'></i>}
            title={"Test Cases"}
            canGoBack={false}
            addBtn={addTestCase}
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
          <TestCaseContainer
            filters={this.selectedFilters()}
            viewOption={view_mode}
            isValidWrite={this.state.isValidWrite}
          />
        </div>
      </div>
    );
  }
}

TestCases.propTypes = {
  testcases: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases,
  filters: filterSelector(state),
  settings: state.settings,
  testcase_filters: state.filters,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getTestcaseSettings,
  editTestcaseSettings,
  getTestcases,
  getTestcaseFilters,
  clearTestcaseSettings
})(withRouter(TestCases));

const getSettings = state => state.settings.testcase_settings;
const getTestcaseFilterProps = state => state.filters.testcase_filters;

const filterSelector = createSelector([getSettings, getTestcaseFilterProps], (testcase_settings, testcase_filters) => {
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
  var selectedGroups = [];

  var activeFilters = false;

  if (testcase_settings && testcase_filters) {
    if (testcase_filters.groups) {
      var selectedGroup = [];
      testcase_filters.groups.map(function(item) {
        if (testcase_settings && testcase_settings.groups) {
          if (testcase_settings.groups.includes(item.id)) {
            selectedGroup.push({ id: item.id, title: item.title, color: item.color });
          }
        }
        return selectedGroup;
      });
      selectedGroups = selectedGroup;
    }

    if (testcase_filters.users) {
      var selectedUsersObjects = [];
      testcase_filters.users.map(function(item) {
        if (testcase_settings && testcase_settings.users) {
          if (testcase_settings.users.includes(item.id)) {
            selectedUsersObjects.push({ id: item.id, title: `${item.first_name} ${item.last_name}` });
          }
        }
        return selectedUsersObjects;
      });
      selectedUsers = selectedUsersObjects;
    }

    if (testcase_settings.date_from) {
      dateFrom = testcase_settings.date_from;
      selectedDateTimestampFrom = moment(testcase_settings.date_from)._d;
      selectedDateFrom = moment(testcase_settings.date_from).format(" Do MMM YY");
      selectedDateFromFormated = moment(testcase_settings.date_from).format("YYYY-MM-DD");
    }
    if (testcase_settings.date_to) {
      dateTo = testcase_settings.date_to;
      selectedDateTimestampTo = moment(testcase_settings.date_to)._d;
      selectedDateTo = moment(testcase_settings.date_to).format(" Do MMM YY");
      selectedDateToFormated = moment(testcase_settings.date_to).format("YYYY-MM-DD");
    }
    if (testcase_settings.view_mode) {
      viewMode = testcase_settings.view_mode;
    }
    showFilters = testcase_settings.show_filters;
    if (testcase_settings.search_term !== null) {
      searchTerm = testcase_settings.search_term;
    }

    if (
      !isEmpty(selectedUsers) ||
      !isEmpty(selectedGroups) ||
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
      selectedGroups,
      activeFilters,
      selectedDateFromFormated,
      selectedDateToFormated
    };
  }
  return {};
});
