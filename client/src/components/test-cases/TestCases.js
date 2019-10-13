import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import GlobalPanel from "../global-panel/GlobalPanel";
import ProjectPanel from "../project-panel/ProjectPanel";
import BtnAnchor from "../common/BtnAnchor";
import FilterBtn from "../common/FilterBtn";
import Header from "../common/Header";
import SearchBtn from "../common/SearchBtn";
import TestCaseContainer from "../test-cases/TestCaseContainer";
import { getGroups } from "../../actions/groupsActions";
import { getUsers } from "../../actions/userActions";
import { getUserSettings, editUserSettings } from "../../actions/settingsActions";
import { testcasesPermissions, addTestcasesPermissions } from "../../permissions/TestcasePermissions";

import getidsFromObjectArray from "../../utility/getIdsFromObjArray";

import SearchDropdown from "../common/SearchDropdown";
import Datepicker from "../common/Datepicker";
import isEmpty from "../../validation/isEmpty";
import Tag from "../common/Tag";
import moment from "moment";

const WAIT_INTERVAL = 500;
const ENTER_KEY = 13;
class TestCases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: "",
      values: "",
      showFilters: true,
      isValid: false,
      value: null,
      arrayValue: [],
      user: this.props.auth.user,
      selectedUsers: [],
      users: [],
      usersWithTestcases: [],
      projectGroups: [],
      activeFilters: false,
      showDatepickerFrom: false,
      selectedDateFrom: "",
      selectedDateTimestampFrom: "",
      activeDateFrom: "",
      isValidWrite: false,
      showDatepickerTo: false,
      selectedDateTo: "",
      selectedDateTimestampTo: "",
      activeDateTo: "",
      testcaseFilters: {},
      searchTerm: "",
      settings: this.props.settings.settings,
      selectedGroupFilters: []
    };
    this.filterBtn = this.filterBtn.bind(this);
    this.selectMultipleOptionGroups = this.selectMultipleOptionGroups.bind(this);
    this.selectMultipleOptionUsers = this.selectMultipleOptionUsers.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    if (nextProps.auth && nextProps.auth.user) {
      var { isValid } = testcasesPermissions(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );
      if (!isValid) {
        nextProps.history.push(`/Projects`);
      }
      update.isValid = isValid;

      var usersWithTestcases = [];
      if (nextProps.users && nextProps.users.users) {
        if (nextProps.users.users !== prevState.users) {
          nextProps.users.users.map(function(item) {
            return usersWithTestcases.push({ id: item.id, title: `${item.first_name} ${item.last_name}` });
          });
          update.usersWithTestcases = usersWithTestcases;
        }
      }

      // var projectGroups = [];
      if (nextProps.groups && nextProps.groups.groups) {
        update.projectGroups = nextProps.groups.groups;

        var selectedGroups = [];
        nextProps.groups.groups.map(function(item) {
          if (
            nextProps.settings.settings &&
            nextProps.settings.settings.testcase &&
            nextProps.settings.settings.testcase.groups
          ) {
            if (nextProps.settings.settings.testcase.groups.includes(item.id)) {
              selectedGroups.push({ id: item.id, title: item.title, color: item.color });
            }
          }
          return selectedGroups;
        });
        update.selectedGroupFilters = selectedGroups;
      }

      if (nextProps.users && nextProps.users.users) {
        update.users = nextProps.users.users;

        var selectedUsers = [];
        nextProps.users.users.map(function(item) {
          if (
            nextProps.settings.settings &&
            nextProps.settings.settings.testcase &&
            nextProps.settings.settings.testcase.users
          ) {
            if (nextProps.settings.settings.testcase.users.includes(item.id)) {
              selectedUsers.push({ id: item.id, title: `${item.first_name} ${item.last_name}` });
            }
          }
          return selectedUsers;
        });
        update.selectedUsers = selectedUsers;
      }

      if (
        nextProps.settings.settings &&
        nextProps.settings.settings.testcase &&
        nextProps.settings.settings.testcase.date_from
      ) {
        update.selectedDateTimestampFrom = moment(nextProps.settings.settings.testcase.date_from)._d;
        update.selectedDateFrom = moment(nextProps.settings.settings.testcase.date_from).format(" Do MMM YY");
        console.log("test selectedDate");
      }

      if (
        nextProps.settings.settings &&
        nextProps.settings.settings.testcase &&
        nextProps.settings.settings.testcase.date_to
      ) {
        update.selectedDateTimestampTo = moment(nextProps.settings.settings.testcase.date_to)._d;
        update.selectedDateTo = moment(nextProps.settings.settings.testcase.date_to).format(" Do MMM YY");
      }

      var isValidWrite = addTestcasesPermissions(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );
    }
    if (nextProps.settings && nextProps.settings.settings) {
      // console.log(nextProps.settings);
      // console.log(prevState.settings);
      if (nextProps.settings.settings !== prevState.settings) update.settings = nextProps.settings.settings;
      // if (nextProps.settings.settings.testcase && nextProps.settings.settings.testcase.groups === null) {
      //   update.settings.testcase.groups = [];
      // }
      // if (nextProps.settings.settings.testcase && nextProps.settings.settings.testcase.users === null) {
      //   update.settings.testcase.users = [];
      // }

      if (nextProps.settings.settings.testcase && prevState.settings) {
        console.log(nextProps.settings.settings.testcase.search_term);
        console.log(prevState.settings.testcase.search_term);
        if (nextProps.settings.settings.testcase.search_term !== prevState.settings.testcase.search_term) {
          update.settings.testcase.search_term = prevState.settings.testcase.search_term;
          console.log("test");
        }
      }

      if (nextProps.settings.settings.testcase && nextProps.settings.settings.testcase.date_from === null) {
        update.settings.testcase.date_from = "";
      }
      if (nextProps.settings.settings.testcase && nextProps.settings.settings.testcase.date_to === null) {
        update.settings.testcase.date_to = "";
      }
    }
    // console.log(prevState);
    update.isValidWrite = isValidWrite.isValid;
    return Object.keys(update).length ? update : null;
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClick, false);
    if (this.state.isValid) {
      var projectId = this.props.match.params.projectId;
      this.props.getGroups(projectId);
      this.props.getUserSettings(this.props.auth.user.id);
    }
    var has_testcases = true;
    this.props.getUsers(has_testcases);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick, false);
  }
  search() {
    // var testCaseFilters = {};
    // testCaseFilters.groups = getidsFromObjectArray(this.state.selectedGroupFilters);
    // testCaseFilters.users = getidsFromObjectArray(this.state.users);
    // testCaseFilters.dateFrom = "";
    // if (moment(this.state.selectedDateTimestampFrom).format("YYYY-MM-DD") !== "Invalid date") {
    //   testCaseFilters.dateFrom = moment(this.state.selectedDateTimestampFrom).format("YYYY-MM-DD HH:mm:ss");
    // }
    // testCaseFilters.dateTo = "";
    // if (moment(this.state.selectedDateTimestampTo).format("YYYY-MM-DD ") !== "Invalid date") {
    //   testCaseFilters.dateTo = moment(this.state.selectedDateTimestampTo)
    //     .add(21, "hours")
    //     .add(59, "minutes")
    //     .add(59, "seconds")
    //     .format("YYYY-MM-DD HH:mm:ss");
    // }
    // testCaseFilters.searchTerm = this.state.searchTerm;
    // testCaseFilters.date_to = testCaseFilters.dateTo !== "" ? testCaseFilters.dateTo : null;
    // testCaseFilters.date_from = testCaseFilters.dateFrom !== "" ? testCaseFilters.dateFrom : null;
    // testCaseFilters.search_term = this.state.searchTerm;
    // testCaseFilters.view_mode = 1;
    // testCaseFilters.show_filters = this.state.settings.testcase.show_filters;
    // var testcase = testCaseFilters;
    // console.log(testcase);
    // this.setState({ settings: testcase });
    // this.props.getUserSettings(this.props.auth.user.id);
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
    testcase.search_term = this.state.searchTerm;
    var payload = { testcase };
    this.setState({ searchTerm: testcase.search_term }, () => {
      this.props.editUserSettings(this.props.auth.user.id, payload, () => {});
    });
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
    this.setState({ selectedUsers: value });

    var testcase = {};
    testcase.users = getidsFromObjectArray(value);
    var payload = { testcase };
    this.props.editUserSettings(this.props.auth.user.id, payload, () => {});
  }

  selectMultipleOptionGroups(value) {
    this.setState({ selectedGroupFilters: value });

    var testcase = {};
    testcase.groups = getidsFromObjectArray(value);
    var payload = { testcase };
    this.props.editUserSettings(this.props.auth.user.id, payload, () => {});
  }

  removeSearchTerm() {
    this.setState({ searchTerm: "" }, () => {
      this.checkActiveFilters();
    });
  }
  removeGroupFilter(e) {
    var groups = this.state.selectedGroupFilters.filter(function(item) {
      return item["id"] !== e;
    });

    var testcase = {};
    testcase.groups = getidsFromObjectArray(groups);
    var payload = { testcase };

    this.setState({ selectedGroupFilters: groups }, () => {
      this.checkActiveFilters();
      this.props.editUserSettings(this.props.auth.user.id, payload, () => {});
    });
  }
  removeUser(e) {
    var selectedUsers = this.state.selectedUsers.filter(function(item) {
      return item["id"] !== e;
    });

    var testcase = {};
    testcase.users = getidsFromObjectArray(selectedUsers);
    var payload = { testcase };

    this.setState({ selectedUsers }, () => {
      this.checkActiveFilters();
      this.props.editUserSettings(this.props.auth.user.id, payload, () => {});
    });
  }

  removeFromDate() {
    this.setState({ selectedDateFrom: "", selectedDateTimestampFrom: "" }, () => {
      this.props.editUserSettings(this.props.auth.user.id, { testcase: { date_from: null } }, () => {});
      this.checkActiveFilters();
    });
  }

  removeToDate() {
    this.setState({ selectedDateTo: "", selectedDateTimestampTo: "" }, () => {
      this.props.editUserSettings(this.props.auth.user.id, { testcase: { date_to: null } }, () => {});
      this.checkActiveFilters();
    });
  }

  filterBtn() {
    // console.log("test");
    var showFilters = !this.state.settings.testcase.show_filters;

    var testcase = {};
    testcase.show_filters = showFilters;
    var payload = { testcase };

    this.props.editUserSettings(this.props.auth.user.id, payload, () => {});
  }
  resetFilters() {
    this.setState(
      {
        testcaseFilters: {},
        selectedDateTo: "",
        selectedDateTimestampTo: "",
        selectedUsers: [],
        selectedGroupFilters: [],
        selectedDateFrom: "",
        selectedDateTimestampFrom: "",
        searchTerm: ""
      },
      () => {
        this.checkActiveFilters();
      }
    );
  }

  checkActiveFilters() {
    var activeFilters = false;
    if (
      !isEmpty(this.state.selectedDateFrom) ||
      !isEmpty(this.state.selectedDateTo) ||
      this.state.selectedUsers.length > 0 ||
      this.state.selectedGroupFilters.length > 0
    ) {
      activeFilters = true;
    }
    this.setState({ activeFilters });
  }

  setViewList(e) {
    var view_mode = 2;
    var testcase = { view_mode };

    var payload = { testcase };

    this.props.editUserSettings(this.props.auth.user.id, payload, () => {});
  }

  setViewGrid(e) {
    var view_mode = 1;
    var testcase = { view_mode };

    var payload = { testcase };
    this.props.editUserSettings(this.props.auth.user.id, payload, () => {});
  }

  render() {
    var activeFilters;
    if (this.state.settings && this.state.settings.testcase) {
      // console.log(this.state.settings.testcase);
      activeFilters = this.state.settings;
    }
    var view_mode;
    var viewOptionGridClass = "";
    var viewOptionListClass = "";
    if (this.state.settings && this.state.settings.testcase) {
      view_mode = this.state.settings.testcase.view_mode;

      if (this.state.settings.testcase.view_mode === 1) {
        viewOptionGridClass = "activeView";
        viewOptionListClass = "";
      } else if (this.state.settings.testcase.view_mode === 2) {
        viewOptionGridClass = "";
        viewOptionListClass = "activeView";
      }
    }
    if (this.state.settings && this.state.settings.testcase) {
      var searchTerm = "";
      if (!isEmpty(this.state.settings.testcase.search_term)) {
        searchTerm = (
          <Tag
            title={`Search: ${this.state.settings.testcase.search_term}`}
            color={"DATE_COLOR"}
            isRemovable={true}
            onClickRemove={e => this.removeSearchTerm(e)}
          />
        );
      }
    }
    var fromDate = "";
    if (!isEmpty(this.state.selectedDateFrom)) {
      fromDate = (
        <Tag
          title={`From: ${this.state.selectedDateFrom}`}
          color={"DATE_COLOR"}
          isRemovable={true}
          onClickRemove={e => this.removeFromDate(e)}
        />
      );
    }
    var toDate = "";
    if (!isEmpty(this.state.selectedDateTo)) {
      toDate = (
        <Tag
          title={`To: ${this.state.selectedDateTo}`}
          color={"DATE_COLOR"}
          isRemovable={true}
          onClickRemove={e => this.removeToDate(e)}
        />
      );
    }
    var resetFiltersTag = "";
    if (
      !isEmpty(this.state.testcaseFilters.users) ||
      !isEmpty(this.state.testcaseFilters.groups) ||
      !isEmpty(this.state.testcaseFilters.dateFrom) ||
      !isEmpty(this.state.testcaseFilters.dateTo) ||
      !isEmpty(this.state.testcaseFilters.searchTerm)
    ) {
      resetFiltersTag = (
        <Tag title={"Reset all"} color={"RESET_COLOR"} isRemovable={true} onClickRemove={e => this.resetFilters()} />
      );
    }
    var filters = <div className="padding"></div>;
    if (this.state.settings && this.state.settings.testcase && this.state.settings.testcase.show_filters) {
      filters = (
        <div>
          <div className="testcase-grid">
            <SearchDropdown
              value={this.state.selectedGroupFilters}
              options={this.state.projectGroups}
              onChange={this.selectMultipleOptionGroups}
              label={"Test Groups"}
              placeholder={"Groups"}
              multiple={true}
            />

            <SearchDropdown
              value={this.state.selectedUsers}
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
              selectedDate={this.state.selectedDateFrom}
              onClick={e => this.setState({ showDatepickerFrom: !this.state.showDatepickerFrom })}
              onChange={e => this.setState({ showDatepickerFrom: !this.state.showDatepickerFrom })}
              active={this.state.activeDateFrom ? this.state.activeDateFrom !== null : ""}
              timestamp={this.state.selectedDateTimestampFrom}
              onDayClick={day => {
                this.setState({ selectedDateFrom: moment(day).format(" Do MMM YY") }, () => {
                  this.search();
                  this.checkActiveFilters();
                });
                this.setState({ selectedDateTimestampFrom: day });
                this.setState({ showDatepickerFrom: false });
                this.props.editUserSettings(
                  this.props.auth.user.id,
                  {
                    testcase: { date_from: moment(day).format("YYYY-MM-DD HH:mm:ss") }
                  },
                  () => {}
                );
              }}
            />
            <Datepicker
              forwardRef={node2 => (this.node2 = node2)}
              showdatepicker={this.state.showDatepickerTo}
              placeholder={"To Date"}
              label={"Select Date"}
              selectedDate={this.state.selectedDateTo}
              onClick={e => this.setState({ showDatepickerTo: !this.state.showDatepickerTo })}
              onChange={e => this.setState({ showDatepickerTo: !this.state.showDatepickerTo })}
              active={this.state.activeDateTo ? this.state.activeDateTo !== null : ""}
              timestamp={this.state.selectedDateTimestampTo}
              onDayClick={day => {
                this.setState({ selectedDateTo: moment(day).format(" Do MMM YY") }, () => {
                  this.search();
                  this.checkActiveFilters();
                });
                this.setState({ selectedDateTimestampTo: day });
                this.setState({ showDatepickerTo: false });
                this.props.editUserSettings(
                  this.props.auth.user.id,
                  {
                    testcase: { date_to: moment(day).format("YYYY-MM-DD HH:mm:ss") }
                  },
                  () => {}
                );
              }}
            />
          </div>

          <div className="active-filter-container">
            {this.state.selectedGroupFilters &&
              this.state.selectedGroupFilters.map((group, index) => (
                <Tag
                  key={index}
                  title={group.title}
                  color={group.color}
                  isRemovable={true}
                  onClickRemove={e => this.removeGroupFilter(group.id)}
                />
              ))}
            {this.state.selectedUsers &&
              this.state.selectedUsers.map((user, index) => (
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
        <BtnAnchor type={"text"} label="Add New" className={"a-btn a-btn-primary"} link={`CreateTestCase`} />
      );
    }

    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-clipboard-list"></i>}
            title={"Test Cases"}
            link={"CreateTestCase"}
            canGoBack={false}
            addBtn={addTestCase}
            filterBtn={
              <FilterBtn
                onClick={this.filterBtn}
                activeFilters={this.state.activeFilters}
                // filtersShown={this.state.settings.activeFilters}
                filtersShown={true}
              />
            }
            searchBtn={
              <SearchBtn
                name={"search"}
                searchActive={this.state.searchTerm}
                value={this.state.searchTerm}
                onChange={e => this.handleChange(e)}
                onKeyDown={this.handleKeyDown}
              />
            }
          />
          <div className="view-options">
            <div className={`view-options--list clickable ${viewOptionListClass}`} onClick={e => this.setViewList(e)}>
              <i className="fas fa-bars "></i>
            </div>
            <div className={`view-options--grid clickable ${viewOptionGridClass}`} onClick={e => this.setViewGrid(e)}>
              <i className="fas fa-th "></i>
            </div>
          </div>
          {filters}
          {/* <TestCaseContainer filters={this.state.testcaseFilters} viewOption={this.state.settings.testcase.view_mode} /> */}
          <TestCaseContainer filters={this.props.settings} viewOption={view_mode} />
        </div>
      </div>
    );
  }
}

TestCases.propTypes = {
  testcases: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases,
  groups: state.groups,
  users: state.users,
  settings: state.settings,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getGroups, getUsers, getUserSettings, editUserSettings }
)(withRouter(TestCases));
