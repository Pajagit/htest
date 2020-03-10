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
import {
  getReportSettings,
  editReportSettings,
  getTestcaseSettings,
  clearReportSettings
} from "../../../actions/settingsActions";
import { getStatuses } from "../../../actions/statusActions";
import { getDevices } from "../../../actions/deviceActions";
import { getEnvironments } from "../../../actions/environmentActions";
import { getVersions } from "../../../actions/versionAction";
import { getBrowsers } from "../../../actions/browserActions";
import { getSimulators } from "../../../actions/simulatorActions";
import { getOperatingSystems } from "../../../actions/osActions";
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
      if (nextProps.users && nextProps.users.users) {
        if (nextProps.users.users !== prevState.users) {
          nextProps.users.users.map(function(item) {
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
      if (nextProps.simulators && nextProps.simulators.simulators) {
        update.projectSimulators = nextProps.simulators.simulators.simulators;
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
      this.props.getSimulators(projectId);
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
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroups);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.date_from =
      this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
    testcase.date_to =
      this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
    testcase.search_term = this.state.searchTerm;
    this.props.getReports(
      this.props.match.params.projectId
      // , testcase
    );

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

  selectMultipleOptionUsers(value) {
    this.setState({ selectedUsers: value }, () => {
      var testcase = {};
      testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroups);
      testcase.users = getidsFromObjectArray(this.state.selectedUsers);
      testcase.date_from = this.props.filters.selectedDateFromFormated;
      testcase.date_to = this.props.filters.selectedDateToFormated;
      testcase.search_term = this.state.searchTerm;
      this.props.getReports(
        this.props.match.params.projectId
        // , testcase
      );
      this.props.editReportSettings(this.props.match.params.projectId, { users: testcase.users });
    });
  }

  selectMultipleOptionGroups(value) {
    this.setState({ selectedGroups: value }, () => {
      var testcase = {};
      testcase.groups = getidsFromObjectArray(this.state.selectedGroups);
      this.props.getReports(
        this.props.match.params.projectId
        // , testcase
      );
      this.props.editReportSettings(this.props.match.params.projectId, { groups: testcase.groups });
    });
  }
  selectMultipleOptionStatuses(value) {
    this.setState({ selectedStatuses: value }, () => {
      var testcase = {};
      testcase.statuses = getidsFromObjectArray(this.state.selectedStatuses);
      this.props.getReports(
        this.props.match.params.projectId
        // , testcase
      );
      this.props.editReportSettings(this.props.match.params.projectId, { statuses: testcase.statuses });
    });
  }

  selectMultipleOptionDevices(value) {
    this.setState({ selectedDevices: value }, () => {
      var testcase = {};
      testcase.devices = getidsFromObjectArray(this.state.selectedDevices);
      this.props.getReports(
        this.props.match.params.projectId
        // , testcase
      );
      this.props.editReportSettings(this.props.match.params.projectId, { devices: testcase.devices });
    });
  }
  selectMultipleOptionBrowsers(value) {
    this.setState({ selectedBrowsers: value }, () => {
      var testcase = {};
      testcase.browsers = getidsFromObjectArray(this.state.selectedBrowsers);
      this.props.getReports(
        this.props.match.params.projectId
        // , testcase
      );
      this.props.editReportSettings(this.props.match.params.projectId, { browsers: testcase.browsers });
    });
  }

  selectMultipleOptionOss(value) {
    this.setState({ selectedOss: value }, () => {
      var testcase = {};
      testcase.operatingsystems = getidsFromObjectArray(this.state.selectedOss);
      this.props.getReports(
        this.props.match.params.projectId
        // , testcase
      );
      this.props.editReportSettings(this.props.match.params.projectId, { operatingsystems: testcase.operatingsystems });
    });
  }

  selectMultipleOptionEnvironments(value) {
    this.setState({ selectedEnvironments: value }, () => {
      var testcase = {};
      testcase.environments = getidsFromObjectArray(this.state.selectedEnvironments);
      this.props.getReports(
        this.props.match.params.projectId
        // , testcase
      );
      this.props.editReportSettings(this.props.match.params.projectId, { environments: testcase.environments });
    });
  }

  selectMultipleOptionVersions(value) {
    this.setState({ selectedVersions: value }, () => {
      var testcase = {};
      testcase.versions = getidsFromObjectArray(this.state.selectedVersions);
      this.props.getReports(
        this.props.match.params.projectId
        // , testcase
      );
      this.props.editReportSettings(this.props.match.params.projectId, { versions: testcase.versions });
    });
  }
  selectMultipleOptionSimulators(value) {
    this.setState({ selectedSimulators: value }, () => {
      var testcase = {};
      testcase.simulators = getidsFromObjectArray(this.state.selectedSimulators);
      this.props.getReports(
        this.props.match.params.projectId
        // , testcase
      );
      this.props.editReportSettings(this.props.match.params.projectId, { simulators: testcase.simulators });
    });
  }

  removeSearchTerm() {
    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroups);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.date_from =
      this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
    testcase.date_to =
      this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
    testcase.search_term = "";
    this.props.getReports(
      this.props.match.params.projectId
      // , testcase
    );

    this.props.editReportSettings(this.props.match.params.projectId, { search_term: null });
    this.setState({ searchTerm: "" });
  }
  removeGroupFilter(e) {
    var groups = this.props.filters.selectedGroups.filter(function(item) {
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
    this.props.getReports(
      this.props.match.params.projectId
      // , testcase
    );

    this.setState({ selectedGroups: groups }, () => {
      this.props.editReportSettings(this.props.match.params.projectId, testcase);
    });
  }
  removeUser(e) {
    var selectedUsers = this.state.selectedUsers.filter(function(item) {
      return item["id"] !== e;
    });

    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroups);
    testcase.users = getidsFromObjectArray(selectedUsers);
    testcase.date_from =
      this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
    testcase.date_to =
      this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
    testcase.search_term = "";
    this.props.getReports(
      this.props.match.params.projectId
      // , testcase
    );

    this.setState({ selectedUsers }, () => {
      this.props.editReportSettings(this.props.match.params.projectId, testcase);
    });
  }

  removeDevice(e) {
    var selectedDevices = this.props.filters.selectedDevices.filter(function(item) {
      return item["id"] !== e;
    });

    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroups);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.devices = getidsFromObjectArray(selectedDevices);
    testcase.browsers = getidsFromObjectArray(this.props.filters.selectedBrowsers);
    testcase.environments = getidsFromObjectArray(this.props.filters.selectedEnvironments);
    testcase.operatingsystems = getidsFromObjectArray(this.props.filters.selectedOss);
    testcase.versions = getidsFromObjectArray(this.props.filters.selectedVersions);
    testcase.statuses = getidsFromObjectArray(this.props.filters.selectedStatuses);
    testcase.date_from =
      this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
    testcase.date_to =
      this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
    testcase.search_term = "";
    this.props.getReports(
      this.props.match.params.projectId
      // , testcase
    );

    this.setState({ selectedDevices }, () => {
      this.props.editReportSettings(this.props.match.params.projectId, testcase);
    });
  }

  removeBrowser(e) {
    var selectedBrowsers = this.props.filters.selectedBrowsers.filter(function(item) {
      return item["id"] !== e;
    });

    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroups);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.devices = getidsFromObjectArray(this.props.filters.selectedDevices);
    testcase.browsers = getidsFromObjectArray(selectedBrowsers);
    testcase.environments = getidsFromObjectArray(this.props.filters.selectedEnvironments);
    testcase.operatingsystems = getidsFromObjectArray(this.props.filters.selectedOss);
    testcase.versions = getidsFromObjectArray(this.props.filters.selectedVersions);
    testcase.statuses = getidsFromObjectArray(this.props.filters.selectedStatuses);
    testcase.date_from =
      this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
    testcase.date_to =
      this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
    testcase.search_term = "";
    this.props.getReports(
      this.props.match.params.projectId
      // , testcase
    );

    this.setState({ selectedBrowsers }, () => {
      this.props.editReportSettings(this.props.match.params.projectId, testcase);
    });
  }

  removeEnvironment(e) {
    var selectedEnvironments = this.props.filters.selectedEnvironments.filter(function(item) {
      return item["id"] !== e;
    });

    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroups);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.devices = getidsFromObjectArray(this.props.filters.selectedDevices);
    testcase.browsers = getidsFromObjectArray(this.props.filters.selectedBrowsers);
    testcase.environments = getidsFromObjectArray(selectedEnvironments);
    testcase.operatingsystems = getidsFromObjectArray(this.props.filters.selectedOss);
    testcase.versions = getidsFromObjectArray(this.props.filters.selectedVersions);
    testcase.statuses = getidsFromObjectArray(this.props.filters.selectedStatuses);
    testcase.date_from =
      this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
    testcase.date_to =
      this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
    testcase.search_term = "";
    this.props.getReports(
      this.props.match.params.projectId
      // , testcase
    );

    this.setState({ selectedEnvironments }, () => {
      this.props.editReportSettings(this.props.match.params.projectId, testcase);
    });
  }

  removeOs(e) {
    var selectedOss = this.props.filters.selectedOss.filter(function(item) {
      return item["id"] !== e;
    });

    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroups);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.devices = getidsFromObjectArray(this.props.filters.selectedDevices);
    testcase.browsers = getidsFromObjectArray(this.props.filters.selectedBrowsers);
    testcase.operatingsystems = getidsFromObjectArray(selectedOss);
    testcase.versions = getidsFromObjectArray(this.props.filters.selectedVersions);
    testcase.environments = getidsFromObjectArray(this.props.filters.selectedEnvironments);
    testcase.statuses = getidsFromObjectArray(this.props.filters.selectedStatuses);
    testcase.date_from =
      this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
    testcase.date_to =
      this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
    testcase.search_term = "";
    this.props.getReports(
      this.props.match.params.projectId
      // , testcase
    );

    this.setState({ selectedOss }, () => {
      this.props.editReportSettings(this.props.match.params.projectId, testcase);
    });
  }
  removeVersion(e) {
    var selectedVersions = this.props.filters.selectedVersions.filter(function(item) {
      return item["id"] !== e;
    });

    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroups);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.devices = getidsFromObjectArray(this.props.filters.selectedDevices);
    testcase.browsers = getidsFromObjectArray(this.props.filters.selectedBrowsers);
    testcase.operatingsystems = getidsFromObjectArray(this.props.filters.selectedOss);
    testcase.environments = getidsFromObjectArray(this.props.filters.selectedEnvironments);
    testcase.versions = getidsFromObjectArray(selectedVersions);
    testcase.statuses = getidsFromObjectArray(this.props.filters.selectedStatuses);
    testcase.date_from =
      this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
    testcase.date_to =
      this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
    testcase.search_term = "";
    this.props.getReports(
      this.props.match.params.projectId
      // , testcase
    );

    this.setState({ selectedVersions }, () => {
      this.props.editReportSettings(this.props.match.params.projectId, testcase);
    });
  }

  removeStatus(e) {
    var selectedStatuses = this.props.filters.selectedStatuses.filter(function(item) {
      return item["id"] !== e;
    });

    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroups);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.devices = getidsFromObjectArray(this.props.filters.selectedDevices);
    testcase.browsers = getidsFromObjectArray(this.props.filters.selectedBrowsers);
    testcase.operatingsystems = getidsFromObjectArray(this.props.filters.selectedOss);
    testcase.versions = getidsFromObjectArray(this.props.filters.selectedVersions);
    testcase.environments = getidsFromObjectArray(this.props.filters.selectedEnvironments);
    testcase.statuses = getidsFromObjectArray(selectedStatuses);
    testcase.date_from =
      this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
    testcase.date_to =
      this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
    testcase.search_term = "";
    this.props.getReports(
      this.props.match.params.projectId
      // , testcase
    );

    this.setState({ selectedStatuses }, () => {
      this.props.editReportSettings(this.props.match.params.projectId, testcase);
    });
  }

  removeSimulator(e) {
    var selectedSimulators = this.props.filters.selectedSimulators.filter(function(item) {
      return item["id"] !== e;
    });

    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroups);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.devices = getidsFromObjectArray(this.props.filters.selectedDevices);
    testcase.browsers = getidsFromObjectArray(this.props.filters.selectedBrowsers);
    testcase.operatingsystems = getidsFromObjectArray(this.props.filters.selectedOss);
    testcase.versions = getidsFromObjectArray(this.props.filters.selectedVersions);
    testcase.environments = getidsFromObjectArray(this.props.filters.selectedEnvironments);
    testcase.statuses = getidsFromObjectArray(this.props.filters.selectedStatuses);
    testcase.simulators = getidsFromObjectArray(selectedSimulators);
    testcase.date_from =
      this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
    testcase.date_to =
      this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
    testcase.search_term = "";
    this.props.getReports(
      this.props.match.params.projectId
      // , testcase
    );

    this.setState({ selectedSimulators }, () => {
      this.props.editReportSettings(this.props.match.params.projectId, testcase);
    });
  }

  removeFromDate() {
    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroups);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.date_from = null;
    testcase.date_to =
      this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
    testcase.search_term = "";
    this.props.getReports(
      this.props.match.params.projectId
      // , testcase
    );
    this.props.editReportSettings(this.props.match.params.projectId, { date_from: null });
  }
  setFromDate(day) {
    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroups);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.date_from = moment(day).format("YYYY-MM-DD HH:mm:ss");
    testcase.date_to =
      this.props.filters.selectedDateToFormated !== "" ? this.props.filters.selectedDateToFormated : null;
    testcase.search_term = this.state.searchTerm;
    this.props.getReports(
      this.props.match.params.projectId
      // , testcase
    );
  }
  setToDate(day) {
    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroups);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.date_from =
      this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
    testcase.date_to = moment(day).format("YYYY-MM-DD HH:mm:ss");

    testcase.search_term = this.state.searchTerm;
    this.props.getReports(
      this.props.match.params.projectId
      // , testcase
    );
  }

  removeToDate() {
    var testcase = {};
    testcase.groups = getidsFromObjectArray(this.props.filters.selectedGroups);
    testcase.users = getidsFromObjectArray(this.props.filters.selectedUsers);
    testcase.date_from =
      this.props.filters.selectedDateFromFormated !== "" ? this.props.filters.selectedDateFromFormated : null;
    testcase.date_to = null;
    testcase.search_term = "";
    this.props.getReports(
      this.props.match.params.projectId
      // , testcase
    );
    this.props.editReportSettings(this.props.match.params.projectId, { date_to: null });
  }

  filterBtn() {
    var showFilters = !this.props.filters.showFilters;
    var testcase = {};
    testcase.show_filters = showFilters;

    this.props.editReportSettings(this.props.match.params.projectId, testcase);
  }
  resetFilters() {
    var testcase = {};
    testcase.date_to = null;
    testcase.date_from = null;
    testcase.search_term = "";
    testcase.users = [];
    testcase.groups = [];
    testcase.statuses = [];
    testcase.devices = [];
    testcase.simulators = [];
    testcase.browsers = [];
    testcase.operatingsystems = [];
    testcase.environments = [];
    testcase.versions = [];

    this.props.getReports(
      this.props.match.params.projectId
      // , testcase
    );
    this.props.editReportSettings(this.props.match.params.projectId, testcase);
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
      !isEmpty(this.props.filters.selectedOss) ||
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
                this.props.editReportSettings(this.props.match.params.projectId, {
                  date_to: moment(day).format("YYYY-MM-DD HH:mm:ss")
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
              numberDisplayed={2}
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
              value={this.props.filters.selectedOss}
              options={this.state.projectOss}
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
            {this.props.filters.selectedOss &&
              this.props.filters.selectedOss.map((os, index) => (
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
  simulators: state.simulators,
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
  getSimulators,
  getOperatingSystems,
  getTestcaseSettings,
  getEnvironments,
  getVersions,
  editReportSettings,
  getReports,
  getStatuses,
  clearReportSettings
})(withRouter(Reports));

const getSettings = state => state.settings.report_settings;
const getUsersProps = state => state.users;
const getGroupsProps = state => state.groups;
const getDeviceProps = state => state.devices;
const getBrowserProps = state => state.browsers;
const getSimulatorProps = state => state.simulators;
const getStatusProps = state => state.statuses;
const getEnvironmentProps = state => state.environments;
const getOsProps = state => state.oss;
const getVersionProps = state => state.versions;

const filterSelector = createSelector(
  [
    getSettings,
    getUsersProps,
    getGroupsProps,
    getDeviceProps,
    getBrowserProps,
    getOsProps,
    getEnvironmentProps,
    getVersionProps,
    getStatusProps,
    getSimulatorProps
  ],
  (report_settings, users, groups, devices, browsers, oss, environments, versions, statuses, simulators) => {
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
    var selectedOss = [];
    var selectedEnvironments = [];
    var selectedGroups = [];
    var selectedSimulators = [];
    var selectedVersions = [];
    var selectedStatuses = [];

    var activeFilters = false;

    if (report_settings) {
      if (devices) {
        if (devices.devices) {
          selectedDevices = [];
          devices.devices.devices.map(function(item) {
            if (report_settings && report_settings.devices) {
              if (report_settings.devices.includes(item.id)) {
                selectedDevices.push({ id: item.id, title: item.title });
              }
            }
            return selectedDevices;
          });
        }
      }

      if (browsers) {
        if (browsers.browsers) {
          selectedBrowsers = [];
          browsers.browsers.browsers.map(function(item) {
            if (report_settings && report_settings.browsers) {
              if (report_settings.browsers.includes(item.id)) {
                selectedBrowsers.push({ id: item.id, title: item.title });
              }
            }
            return selectedBrowsers;
          });
        }
      }
      if (simulators) {
        if (simulators.simulators) {
          selectedSimulators = [];
          simulators.simulators.simulators.map(function(item) {
            if (report_settings && report_settings.simulators) {
              if (report_settings.simulators.includes(item.id)) {
                selectedSimulators.push({ id: item.id, title: item.title });
              }
            }
            return selectedSimulators;
          });
        }
      }

      if (statuses) {
        if (statuses.statuses) {
          selectedStatuses = [];
          statuses.statuses.map(function(item) {
            if (report_settings && report_settings.statuses) {
              if (report_settings.statuses.includes(item.id)) {
                selectedStatuses.push({ id: item.id, title: item.title });
              }
            }
            return selectedStatuses;
          });
        }
      }

      if (versions) {
        if (versions.versions) {
          selectedVersions = [];
          versions.versions.versions.map(function(item) {
            if (report_settings && report_settings.versions) {
              if (report_settings.versions.includes(item.id)) {
                selectedVersions.push({ id: item.id, title: item.version });
              }
            }
            return selectedVersions;
          });
        }
      }

      if (environments) {
        if (environments.environments) {
          selectedEnvironments = [];
          environments.environments.environments.map(function(item) {
            if (report_settings && report_settings.environments) {
              if (report_settings.environments.includes(item.id)) {
                selectedEnvironments.push({ id: item.id, title: item.title });
              }
            }
            return selectedEnvironments;
          });
        }
      }

      if (oss) {
        if (oss.oss) {
          selectedOss = [];
          oss.oss.oss.map(function(item) {
            if (report_settings && report_settings.operatingsystems) {
              if (report_settings.operatingsystems.includes(item.id)) {
                selectedOss.push({ id: item.id, title: item.title });
              }
            }
            return selectedOss;
          });
        }
      }
      if (groups) {
        if (groups.groups) {
          selectedGroups = [];
          groups.groups.map(function(item) {
            if (report_settings && report_settings.groups) {
              if (report_settings.groups.includes(item.id)) {
                selectedGroups.push({ id: item.id, title: item.title, color: item.color });
              }
            }
            return selectedGroups;
          });
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
        !isEmpty(selectedGroups) ||
        selectedDateTimestampFrom !== "" ||
        selectedDateTimestampTo !== "" ||
        !isEmpty(selectedStatuses) ||
        !isEmpty(selectedDevices) ||
        !isEmpty(selectedSimulators) ||
        !isEmpty(selectedBrowsers) ||
        !isEmpty(selectedOss) ||
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
        selectedOss,
        selectedVersions,
        selectedStatuses,
        selectedBrowsers,
        activeFilters,
        selectedDateFromFormated,
        selectedDateToFormated
      };
    }
    return {};
  }
);
