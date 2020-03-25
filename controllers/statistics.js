const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const BrowserService = require("../services/browser");
const UserService = require("../services/user");
const StatisticsService = require("../services/statistics");
const TestSetupService = require("../services/testsetup");

module.exports = {
  getStatistics: async function(req, res) {
    var days = req.query.days;
    end_date = null;
    start_date = null;
    if (days) {
      var end_date = new Date();
      var start_date = new Date();
      start_date.setDate(start_date.getDate() - days);
    }

    var totalTestcases = await StatisticsService.getTotalTestcases(req.params.id);
    var totalReports = await StatisticsService.getTotalReports(req.params.id);
    var totalsReportsPassed = await StatisticsService.getTotalReportsPassed(req.params.id);
    var totalsReportsFailed = await StatisticsService.getTotalReportsFailed(req.params.id);
    var most_active_testcases = await StatisticsService.getMostActiveTestcases(5, start_date, end_date, req.params.id);
    var most_testcases_failed = await StatisticsService.getMostTestcasesFailed(5, start_date, end_date, req.params.id);

    if (most_testcases_failed) {
      for (var i = 0; i < most_testcases_failed.length; i++) {
        most_testcases_failed[i].passed = await StatisticsService.getCountReportsPassed(
          most_testcases_failed[i].test_case_id,
          start_date,
          end_date
        );
        most_testcases_failed[i].total = most_testcases_failed[i].failed + most_testcases_failed[i].passed;
        delete most_testcases_failed[i]["test_case_id"];
      }
    }

    var most_user_reports = await StatisticsService.getMostReportsUsers(5, start_date, end_date, req.params.id);
    if (most_user_reports) {
      for (var j = 0; j < most_user_reports.length; j++) {
        most_user_reports[j].passed = await StatisticsService.getCountReportsPassedForUser(
          most_user_reports[j].user_id,
          start_date,
          end_date,
          req.params.id
        );
        most_user_reports[j].failed = await StatisticsService.getCountReportsFailedForUser(
          most_user_reports[j].user_id,
          start_date,
          end_date,
          req.params.id
        );
        delete most_user_reports[j]["user_id"];
      }
    }

    var most_user_testcases = await StatisticsService.getMostTestcasesUsers(5, start_date, end_date, req.params.id);

    var setupItemsOnProject = await TestSetupService.getAlltestSetupItems(req.params.id);
    var versions = false;
    setupItemsOnProject.forEach(item => {
      if (item.title == "Versions" && item.used == true) {
        versions = true;
      }
    });
    if (versions) {
      most_version_failed = await StatisticsService.getMostVersionsFailed(5, start_date, end_date, req.params.id);
    }

    var annual_report = [];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    //curent month
    var today = new Date();
    var endDate = today;
    var startDate = new Date();
    var month = monthNames[startDate.getMonth()];
    var minutes = startDate.getTimezoneOffset() * -1;
    startDate = startDate.setHours(0, minutes, 0, 0);
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);

    var currentMonthTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate, req.params.id);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate, req.params.id);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate, req.params.id);

    var obj = {};
    obj.total = currentMonthTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-1
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthOneTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate, req.params.id);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate, req.params.id);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate, req.params.id);

    var obj = {};
    obj.total = currentMonthOneTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;

    obj.month = month;
    annual_report.push(obj);

    //current month-2
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 2);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 1);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate, req.params.id);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate, req.params.id);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate, req.params.id);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-3
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 2);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate, req.params.id);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate, req.params.id);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate, req.params.id);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-4
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 4);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 3);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate, req.params.id);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate, req.params.id);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate, req.params.id);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-5
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 4);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate, req.params.id);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate, req.params.id);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate, req.params.id);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-6
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 5);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate, req.params.id);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate, req.params.id);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate, req.params.id);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-7
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 7);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 6);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate, req.params.id);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate, req.params.id);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate, req.params.id);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-8
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 8);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 7);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate, req.params.id);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate, req.params.id);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate, req.params.id);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-9
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 9);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 8);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate, req.params.id);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate, req.params.id);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate, req.params.id);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-10
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 10);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 9);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate, req.params.id);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate, req.params.id);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate, req.params.id);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-11
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 10);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate, req.params.id);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate, req.params.id);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate, req.params.id);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    var statistics = {};
    statistics.total_data = {};
    statistics.total_data.total_testcases = {};
    statistics.total_data.total_testcases.value = totalTestcases;

    statistics.total_data.total_reports = {};
    statistics.total_data.total_reports.value = totalReports;

    statistics.total_data.total_passed_reports = {};
    statistics.total_data.total_passed_reports.value = totalsReportsPassed;

    statistics.total_data.total_failed_reports = {};
    statistics.total_data.total_failed_reports.value = totalsReportsFailed;

    statistics.most_active_testcases = most_active_testcases;

    statistics.most_testcases_failed = most_testcases_failed;

    statistics.most_user_reports = most_user_reports;

    statistics.most_user_testcases = most_user_testcases;

    if (versions) {
      statistics.most_version_failed = most_version_failed.slice(0, 5);
    }

    statistics.annual_report = annual_report.reverse();

    return res.status(200).json(statistics);
  },
  getGlobalStatistics: async function(req, res) {
    var days = req.query.days;
    end_date = null;
    start_date = null;
    if (days) {
      var end_date = new Date();
      var start_date = new Date();
      start_date.setDate(start_date.getDate() - days);
    }

    var totalTestcases = await StatisticsService.getTotalTestcases();
    var totalReports = await StatisticsService.getTotalReports();
    var totalsReportsPassed = await StatisticsService.getTotalReportsPassed();
    var totalsReportsFailed = await StatisticsService.getTotalReportsFailed();
    var most_active_projects = await StatisticsService.getMostActiveProjects(5, start_date, end_date);
    var most_reports_failed = await StatisticsService.getMostProjectsTestcasesFailed(5, start_date, end_date);
    var project_most_testcases = await StatisticsService.getMostProjectsTestcases(start_date, end_date);

    var most_user_reports = await StatisticsService.getMostReportsUsers(5, start_date, end_date);
    if (most_user_reports) {
      for (var j = 0; j < most_user_reports.length; j++) {
        most_user_reports[j].passed = await StatisticsService.getCountReportsPassedForUser(
          most_user_reports[j].user_id,
          start_date,
          end_date
        );
        most_user_reports[j].failed = await StatisticsService.getCountReportsFailedForUser(
          most_user_reports[j].user_id,
          start_date,
          end_date
        );
        delete most_user_reports[j]["user_id"];
      }
    }

    var most_user_testcases = await StatisticsService.getMostTestcasesUsers(5, start_date, end_date);

    var most_version_failed = await StatisticsService.getMostVersionsFailed(5, start_date, end_date);

    var annual_report = [];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    //curent month
    var today = new Date();
    var endDate = today;
    var startDate = new Date();
    var month = monthNames[startDate.getMonth()];
    var minutes = startDate.getTimezoneOffset() * -1;
    startDate = startDate.setHours(0, minutes, 0, 0);
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);

    var currentMonthTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate);

    var obj = {};
    obj.total = currentMonthTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-1
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthOneTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate);

    var obj = {};
    obj.total = currentMonthOneTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;

    obj.month = month;
    annual_report.push(obj);

    //current month-2
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 2);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 1);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-3
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 2);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-4
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 4);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 3);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-5
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 4);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-6
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 5);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-7
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 7);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 6);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-8
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 8);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 7);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-9
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 9);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 8);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-10
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 10);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 9);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    //current month-11
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);
    startDate = new Date(startDate);
    var month = monthNames[startDate.getMonth()];
    startDate = startDate.setHours(0, 0, 0, 0);
    startDate = new Date(startDate);
    var minutes = startDate.getTimezoneOffset();
    startDate = startDate.getTime();
    startDate = startDate - minutes * 60 * 1000;
    startDate = new Date(startDate);
    startDate = startDate.setDate(1);
    startDate = new Date(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 10);
    endDate = new Date(endDate);
    var minutes = endDate.getTimezoneOffset();
    endDate = endDate.setDate(0);
    endDate = new Date(endDate);
    endDate = endDate.setHours(23, 23, 59, 999);
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    endDate = endDate - minutes * 60 * 1000;
    endDate = new Date(endDate);

    var currentMonthTwoTotal = await StatisticsService.getTotalReportsAnnual(startDate, endDate);
    var currentMonthPassed = await StatisticsService.getTotalReportsPassedAnnual(startDate, endDate);
    var currentMonthFailed = await StatisticsService.getTotalReportsFailedAnnual(startDate, endDate);

    var obj = {};
    obj.total = currentMonthTwoTotal;
    obj.passed = currentMonthPassed;
    obj.failed = currentMonthFailed;
    obj.month = month;
    annual_report.push(obj);

    var statistics = {};
    statistics.total_data = {};
    statistics.total_data.total_testcases = {};
    statistics.total_data.total_testcases.value = totalTestcases;

    statistics.total_data.total_reports = {};
    statistics.total_data.total_reports.value = totalReports;

    statistics.total_data.total_passed_reports = {};
    statistics.total_data.total_passed_reports.value = totalsReportsPassed;

    statistics.total_data.total_failed_reports = {};
    statistics.total_data.total_failed_reports.value = totalsReportsFailed;

    statistics.most_active_projects = most_active_projects;

    statistics.most_reports_failed = most_reports_failed.slice(0, 5);

    statistics.most_user_reports = most_user_reports;

    statistics.most_user_testcases = most_user_testcases;

    statistics.most_version_failed = most_version_failed.slice(0, 5);

    statistics.project_most_testcases = project_most_testcases.slice(0, 5);

    statistics.annual_report = annual_report.reverse();

    return res.status(200).json(statistics);
  }
};
