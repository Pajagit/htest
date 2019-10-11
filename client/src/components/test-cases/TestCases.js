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
import { testcasesPermissions, addTestcasesPermissions } from "../../permissions/TestcasePermissions";

import getidsFromObjectArray from "../../utility/getIdsFromObjArray";

import SearchDropdown from "../common/SearchDropdown";
import Datepicker from "../common/Datepicker";
import isEmpty from "../../validation/isEmpty";
import Tag from "../common/Tag";
import moment from "moment";

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
      users: [],
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

      groupFilters: []
    };
    this.filterBtn = this.filterBtn.bind(this);
    this.selectMultipleOptionGroups = this.selectMultipleOptionGroups.bind(this);
    this.selectMultipleOptionUsers = this.selectMultipleOptionUsers.bind(this);
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

      var isValidWrite = addTestcasesPermissions(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );
    }
    update.isValidWrite = isValidWrite.isValid;
    return Object.keys(update).length ? update : null;
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClick, false);
    if (this.state.isValid) {
      var projectId = this.props.match.params.projectId;
      this.props.getGroups(projectId);
    }
    var has_testcases = true;
    this.props.getUsers(has_testcases);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick, false);
  }
  search() {
    var testCaseFilters = {};
    testCaseFilters.groups = getidsFromObjectArray(this.state.groupFilters);
    testCaseFilters.users = getidsFromObjectArray(this.state.users);
    testCaseFilters.dateFrom = "";
    if (moment(this.state.selectedDateTimestampFrom).format("YYYY-MM-DD") !== "Invalid date") {
      testCaseFilters.dateFrom = moment(this.state.selectedDateTimestampFrom).format("YYYY-MM-DD HH:mm:ss");
    }
    testCaseFilters.dateTo = "";
    if (moment(this.state.selectedDateTimestampTo).format("YYYY-MM-DD ") !== "Invalid date") {
      testCaseFilters.dateTo = moment(this.state.selectedDateTimestampTo)
        .add(21, "hours")
        .add(59, "minutes")
        .add(59, "seconds")
        .format("YYYY-MM-DD HH:mm:ss");
    }
    this.setState({ testcaseFilters: testCaseFilters });
  }
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
    this.setState({ users: value }, () => {
      this.search();
      this.checkActiveFilters();
    });
  }

  selectMultipleOptionGroups(value) {
    this.setState({ groupFilters: value }, () => {
      this.search();
      this.checkActiveFilters();
    });
  }
  removeFromDate() {
    this.setState({ selectedDateFrom: "", selectedDateTimestampFrom: "" }, () => {
      this.search();
      this.checkActiveFilters();
    });
  }
  removeGroup(e) {
    var groups = this.state.groupFilters.filter(function(item) {
      return item["id"] !== e;
    });
    this.setState({ groupFilters: groups }, () => {
      this.search();
      this.checkActiveFilters();
    });
  }
  removeUser(e) {
    var users = this.state.users.filter(function(item) {
      return item["id"] !== e;
    });
    this.setState({ users }, () => {
      this.search();
      this.checkActiveFilters();
    });
  }
  removeToDate() {
    this.setState({ selectedDateTo: "", selectedDateTimestampTo: "" }, () => {
      this.search();
      this.checkActiveFilters();
    });
  }

  filterBtn() {
    var showFilters;
    if (this.state.showFilters) {
      showFilters = false;
    } else {
      showFilters = true;
    }
    this.setState({ showFilters });
  }
  resetFilters() {
    this.setState(
      {
        testcaseFilters: {},
        selectedDateTo: "",
        selectedDateTimestampTo: "",
        users: [],
        groupFilters: [],
        selectedDateFrom: "",
        selectedDateTimestampFrom: ""
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
      this.state.users.length > 0 ||
      this.state.groupFilters.length > 0
    ) {
      activeFilters = true;
    }
    this.setState({ activeFilters });
  }

  render() {
    var allGroups = [];
    if (this.props.groups && this.props.groups.groups) {
      allGroups = this.props.groups.groups;
    }

    var usersList = [];
    if (this.props.users && this.props.users.users) {
      this.props.users.users.map(function(item) {
        return usersList.push({ id: item.id, title: `${item.first_name} ${item.last_name}` });
      });
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
      !isEmpty(this.state.testcaseFilters.dateTo)
    ) {
      resetFiltersTag = (
        <Tag title={"Reset all"} color={"RESET_COLOR"} isRemovable={true} onClickRemove={e => this.resetFilters()} />
      );
    }

    var filters;

    if (this.state.showFilters) {
      filters = (
        <div>
          <div className="testcase-grid">
            <SearchDropdown
              value={this.state.groupFilters}
              options={allGroups}
              onChange={this.selectMultipleOptionGroups}
              label={"Test Groups"}
              placeholder={"Groups"}
              multiple={true}
            />

            <SearchDropdown
              value={this.state.users}
              options={usersList}
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
              }}
            />
          </div>

          <div className="active-filter-container">
            {this.state.groupFilters.map((group, index) => (
              <Tag
                key={index}
                title={group.title}
                color={group.color}
                isRemovable={true}
                onClickRemove={e => this.removeGroup(group.id)}
              />
            ))}
            {this.state.users.map((user, index) => (
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
            filterBtn={<FilterBtn onClick={this.filterBtn} activeFilters={this.state.activeFilters} />}
            searchBtn={<SearchBtn />}
          />
          {filters}
          <TestCaseContainer filters={this.state.testcaseFilters} />
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
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getGroups, getUsers }
)(withRouter(TestCases));
