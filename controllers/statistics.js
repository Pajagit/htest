const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const BrowserService = require("../services/browser");
const UserService = require("../services/user");
const StatisticsService = require("../services/statistics");
const TestSetupService = require("../services/testsetup");

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

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

module.exports = {
  getStatistics: async function(req, res) {
    var days = req.query.days;
    var option = req.query.option;

    end_date = null;
    start_date = null;
    prev_start_date = null;

    if (days) {
      var end_date = new Date();
      var start_date = new Date();
      var prev_start_date = new Date();
      start_date.setDate(start_date.getDate() - days);
      prev_start_date.setDate(start_date.getDate() - days);
    } else {
      if (option) {
        switch (option) {
          case "current_week":
            var end_date = new Date();
            var start_date = new Date();

            var day = start_date.getDay(),
              diff = start_date.getDate() - day + (day == 0 ? -6 : 1);
            start_date = new Date(start_date.setDate(diff));
            start_date.setHours(0, 0, 0, 0);
            var minutes = start_date.getTimezoneOffset();
            start_date = start_date.getTime();
            start_date = start_date - minutes * 60 * 1000;
            start_date = new Date(start_date);

            var prev_start_date = new Date();
            prev_start_date.setDate(start_date.getDate() - 7);
            prev_start_date.setHours(0, 0, 0, 0);
            var minutes = prev_start_date.getTimezoneOffset();
            prev_start_date = prev_start_date.getTime();
            prev_start_date = prev_start_date - minutes * 60 * 1000;
            prev_start_date = new Date(prev_start_date);

            break;
        }
      }
    }

    var totalTestcases = await StatisticsService.getTotalTestcases(start_date, end_date, req.params.id);
    var totalTestcasesPrevious = await StatisticsService.getTotalTestcases(prev_start_date, start_date, req.params.id);
    if (totalTestcasesPrevious > 0 && days) {
      var totalTestcasesPercentage = Math.round(((totalTestcases / totalTestcasesPrevious) * 100 - 100) * 100) / 100;
    } else {
      var totalTestcasesPercentage = null;
    }

    var totalReports = await StatisticsService.getTotalReports(start_date, end_date, req.params.id);
    var totalReportsPrevious = await StatisticsService.getTotalReports(prev_start_date, start_date, req.params.id);
    if (totalReportsPrevious > 0 && days) {
      var totalReportsPercentage = Math.round(((totalReports / totalReportsPrevious) * 100 - 100) * 100) / 100;
    } else {
      var totalReportsPercentage = null;
    }

    if (totalTestcases && totalReports) {
      var ratio = Math.round((totalReports / totalTestcases) * 100) / 100;
    } else {
      var ratio = null;
    }

    var totalsReportsPassed = await StatisticsService.getTotalReportsPassed(start_date, end_date, req.params.id);
    var totalsReportsPassedPrevious = await StatisticsService.getTotalReportsPassed(
      prev_start_date,
      start_date,
      req.params.id
    );
    if (totalsReportsPassedPrevious > 0 && days) {
      var totalReportsPassedPercentage =
        Math.round(((totalsReportsPassed / totalsReportsPassedPrevious) * 100 - 100) * 100) / 100;
    } else {
      var totalReportsPassedPercentage = null;
    }
    if (totalReports && totalsReportsPassed) {
      var ratioPassedReports = Math.round((totalsReportsPassed / totalReports) * 100 * 100) / 100;
    } else {
      var ratioPassedReports = null;
    }

    var totalsReportsFailed = await StatisticsService.getTotalReportsFailed(start_date, end_date, req.params.id);
    var totalsReportsFailedPrevious = await StatisticsService.getTotalReportsFailed(
      prev_start_date,
      start_date,
      req.params.id
    );
    if (totalsReportsFailedPrevious > 0 && days) {
      var totalReportsFailedPercentage =
        Math.round(((totalsReportsFailed / totalsReportsFailedPrevious) * 100 - 100) * 100) / 100;
    } else {
      var totalReportsFailedPercentage = null;
    }
    if (totalReports && totalsReportsFailed) {
      var ratioFailedReports = Math.round((totalsReportsFailed / totalReports) * 100 * 100) / 100;
    } else {
      var ratioFailedReports = null;
    }

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
    if (days) {
      switch (days) {
        case "3":
          var end_date_annual = new Date();
          var start_date_3 = new Date();
          var start_date_2 = new Date();
          var start_date_1 = new Date();

          start_date_3.setDate(start_date_3.getDate() - 1);
          start_date_2.setDate(start_date_2.getDate() - 2);
          start_date_1.setDate(start_date_1.getDate() - 3);

          //day 1
          var day_1_total = await StatisticsService.getTotalReportsAnnual(start_date_1, start_date_2, req.params.id);
          var day_1_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_1,
            start_date_2,
            req.params.id
          );
          var day_1_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_1,
            start_date_2,
            req.params.id
          );

          var obj = {};
          obj.total = day_1_total;
          obj.passed = day_1_passed;
          obj.failed = day_1_failed;
          obj.title = "day 1";
          annual_report.push(obj);

          //day 2
          var day_2_total = await StatisticsService.getTotalReportsAnnual(start_date_2, start_date_3, req.params.id);
          var day_2_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_2,
            start_date_3,
            req.params.id
          );
          var day_2_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_2,
            start_date_3,
            req.params.id
          );

          var obj = {};
          obj.total = day_2_total;
          obj.passed = day_2_passed;
          obj.failed = day_2_failed;
          obj.title = "day 2";
          annual_report.push(obj);

          //day 3
          var day_1_total = await StatisticsService.getTotalReportsAnnual(start_date_3, end_date_annual, req.params.id);
          var day_1_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_3,
            end_date_annual,
            req.params.id
          );
          var day_1_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_3,
            end_date_annual,
            req.params.id
          );

          var obj = {};
          obj.total = day_1_total;
          obj.passed = day_1_passed;
          obj.failed = day_1_failed;
          obj.title = "day 3";
          annual_report.push(obj);

          break;
        case "7":
          var end_date_annual = new Date();
          var start_date_7 = new Date();
          var start_date_6 = new Date();
          var start_date_5 = new Date();
          var start_date_4 = new Date();
          var start_date_3 = new Date();
          var start_date_2 = new Date();
          var start_date_1 = new Date();

          start_date_7.setDate(start_date_4.getDate() - 1);
          start_date_6.setDate(start_date_4.getDate() - 2);
          start_date_5.setDate(start_date_4.getDate() - 3);
          start_date_4.setDate(start_date_4.getDate() - 4);
          start_date_3.setDate(start_date_3.getDate() - 5);
          start_date_2.setDate(start_date_2.getDate() - 6);
          start_date_1.setDate(start_date_1.getDate() - 7);

          //day 1
          var day_1_total = await StatisticsService.getTotalReportsAnnual(start_date_1, start_date_2, req.params.id);
          var day_1_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_1,
            start_date_2,
            req.params.id
          );
          var day_1_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_1,
            start_date_2,
            req.params.id
          );

          var obj = {};
          obj.total = day_1_total;
          obj.passed = day_1_passed;
          obj.failed = day_1_failed;
          obj.title = "day 1";
          annual_report.push(obj);

          //day 2
          var day_2_total = await StatisticsService.getTotalReportsAnnual(start_date_2, start_date_3, req.params.id);
          var day_2_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_2,
            start_date_3,
            req.params.id
          );
          var day_2_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_2,
            start_date_3,
            req.params.id
          );

          var obj = {};
          obj.total = day_2_total;
          obj.passed = day_2_passed;
          obj.failed = day_2_failed;
          obj.title = "day 2";
          annual_report.push(obj);

          //day 3
          var day_3_total = await StatisticsService.getTotalReportsAnnual(start_date_3, start_date_4, req.params.id);
          var day_3_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_3,
            start_date_4,
            req.params.id
          );
          var day_3_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_3,
            start_date_4,
            req.params.id
          );

          var obj = {};
          obj.total = day_3_total;
          obj.passed = day_3_passed;
          obj.failed = day_3_failed;
          obj.title = "day 3";
          annual_report.push(obj);

          //day 4
          var day_4_total = await StatisticsService.getTotalReportsAnnual(start_date_4, start_date_5, req.params.id);
          var day_4_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_4,
            start_date_5,
            req.params.id
          );
          var day_4_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_4,
            start_date_5,
            req.params.id
          );

          var obj = {};
          obj.total = day_4_total;
          obj.passed = day_4_passed;
          obj.failed = day_4_failed;
          obj.title = "day 4";
          annual_report.push(obj);
          //day 5
          var day_5_total = await StatisticsService.getTotalReportsAnnual(start_date_5, start_date_6, req.params.id);
          var day_5_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_5,
            start_date_6,
            req.params.id
          );
          var day_5_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_5,
            start_date_6,
            req.params.id
          );

          var obj = {};
          obj.total = day_5_total;
          obj.passed = day_5_passed;
          obj.failed = day_5_failed;
          obj.title = "day 5";
          annual_report.push(obj);

          //day 6
          var day_6_total = await StatisticsService.getTotalReportsAnnual(start_date_6, start_date_7, req.params.id);
          var day_6_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_6,
            start_date_7,
            req.params.id
          );
          var day_6_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_6,
            start_date_7,
            req.params.id
          );

          var obj = {};
          obj.total = day_6_total;
          obj.passed = day_6_passed;
          obj.failed = day_6_failed;
          obj.title = "day 6";
          annual_report.push(obj);

          //day 7
          var day_7_total = await StatisticsService.getTotalReportsAnnual(start_date_7, end_date_annual, req.params.id);
          var day_7_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_7,
            end_date_annual,
            req.params.id
          );
          var day_7_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_7,
            end_date_annual,
            req.params.id
          );

          var obj = {};
          obj.total = day_7_total;
          obj.passed = day_7_passed;
          obj.failed = day_7_failed;
          obj.title = "day 7";
          annual_report.push(obj);
          break;

        case "30":
          var end_date_annual = new Date();
          var start_date_4 = new Date();
          var start_date_3 = new Date();
          var start_date_2 = new Date();
          var start_date_1 = new Date();

          var week = 30.0 / 4.0;
          start_date_4.setDate(start_date_4.getDate() - week);
          start_date_3.setDate(start_date_3.getDate() - 2 * week);
          start_date_2.setDate(start_date_2.getDate() - 3 * week);
          start_date_1.setDate(start_date_1.getDate() - 4 * week);

          //week 1
          var week_1_total = await StatisticsService.getTotalReportsAnnual(start_date_1, start_date_2, req.params.id);
          var week_1_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_1,
            start_date_2,
            req.params.id
          );
          var week_1_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_1,
            start_date_2,
            req.params.id
          );

          var obj = {};
          obj.total = week_1_total;
          obj.passed = week_1_passed;
          obj.failed = week_1_failed;
          obj.title = "week 1";
          annual_report.push(obj);

          //week 2
          var week_2_total = await StatisticsService.getTotalReportsAnnual(start_date_2, start_date_3, req.params.id);
          var week_2_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_2,
            start_date_3,
            req.params.id
          );
          var week_2_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_2,
            start_date_3,
            req.params.id
          );

          var obj = {};
          obj.total = week_2_total;
          obj.passed = week_2_passed;
          obj.failed = week_2_failed;
          obj.title = "week 2";
          annual_report.push(obj);

          //week 3
          var week_3_total = await StatisticsService.getTotalReportsAnnual(start_date_3, start_date_4, req.params.id);
          var week_3_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_3,
            start_date_4,
            req.params.id
          );
          var week_3_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_3,
            start_date_4,
            req.params.id
          );

          var obj = {};
          obj.total = week_3_total;
          obj.passed = week_3_passed;
          obj.failed = week_3_failed;
          obj.title = "week 3";
          annual_report.push(obj);

          //week 4
          var week_4_total = await StatisticsService.getTotalReportsAnnual(
            start_date_4,
            end_date_annual,
            req.params.id
          );
          var week_4_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_4,
            end_date_annual,
            req.params.id
          );
          var week_4_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_4,
            end_date_annual,
            req.params.id
          );

          var obj = {};
          obj.total = week_4_total;
          obj.passed = week_4_passed;
          obj.failed = week_4_failed;
          obj.title = "week 4";
          annual_report.push(obj);
          break;

        case "90":
          var end_date_annual = new Date();
          var start_date_12 = new Date();
          var start_date_11 = new Date();
          var start_date_10 = new Date();
          var start_date_9 = new Date();
          var start_date_8 = new Date();
          var start_date_7 = new Date();
          var start_date_6 = new Date();
          var start_date_5 = new Date();
          var start_date_4 = new Date();
          var start_date_3 = new Date();
          var start_date_2 = new Date();
          var start_date_1 = new Date();

          var week = 30.0 / 4.0;
          start_date_12.setDate(start_date_12.getDate() - week);
          start_date_11.setDate(start_date_11.getDate() - 2 * week);
          start_date_10.setDate(start_date_10.getDate() - 3 * week);
          start_date_9.setDate(start_date_9.getDate() - 4 * week);
          start_date_8.setDate(start_date_8.getDate() - 5 * week);
          start_date_7.setDate(start_date_7.getDate() - 6 * week);
          start_date_6.setDate(start_date_6.getDate() - 7 * week);
          start_date_5.setDate(start_date_5.getDate() - 8 * week);
          start_date_4.setDate(start_date_4.getDate() - 9 * week);
          start_date_3.setDate(start_date_3.getDate() - 10 * week);
          start_date_2.setDate(start_date_2.getDate() - 11 * week);
          start_date_1.setDate(start_date_1.getDate() - 12 * week);

          //week 1
          var week_1_total = await StatisticsService.getTotalReportsAnnual(start_date_1, start_date_2, req.params.id);
          var week_1_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_1,
            start_date_2,
            req.params.id
          );
          var week_1_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_1,
            start_date_2,
            req.params.id
          );

          var obj = {};
          obj.total = week_1_total;
          obj.passed = week_1_passed;
          obj.failed = week_1_failed;
          obj.title = "week 1";
          annual_report.push(obj);

          //week 2
          var week_2_total = await StatisticsService.getTotalReportsAnnual(start_date_2, start_date_3, req.params.id);
          var week_2_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_2,
            start_date_3,
            req.params.id
          );
          var week_2_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_2,
            start_date_3,
            req.params.id
          );

          var obj = {};
          obj.total = week_2_total;
          obj.passed = week_2_passed;
          obj.failed = week_2_failed;
          obj.title = "week 2";
          annual_report.push(obj);

          //week 3
          var week_3_total = await StatisticsService.getTotalReportsAnnual(start_date_3, start_date_4, req.params.id);
          var week_3_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_3,
            start_date_4,
            req.params.id
          );
          var week_3_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_3,
            start_date_4,
            req.params.id
          );

          var obj = {};
          obj.total = week_3_total;
          obj.passed = week_3_passed;
          obj.failed = week_3_failed;
          obj.title = "week 3";
          annual_report.push(obj);

          //week 4
          var week_4_total = await StatisticsService.getTotalReportsAnnual(start_date_4, start_date_5, req.params.id);
          var week_4_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_4,
            start_date_5,
            req.params.id
          );
          var week_4_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_4,
            start_date_5,
            req.params.id
          );

          var obj = {};
          obj.total = week_4_total;
          obj.passed = week_4_passed;
          obj.failed = week_4_failed;
          obj.title = "week 4";
          annual_report.push(obj);

          //week 5
          var week_5_total = await StatisticsService.getTotalReportsAnnual(start_date_5, start_date_6, req.params.id);
          var week_5_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_5,
            start_date_6,
            req.params.id
          );
          var week_5_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_5,
            start_date_6,
            req.params.id
          );

          var obj = {};
          obj.total = week_5_total;
          obj.passed = week_5_passed;
          obj.failed = week_5_failed;
          obj.title = "week 5";
          annual_report.push(obj);

          //week 6
          var week_6_total = await StatisticsService.getTotalReportsAnnual(start_date_6, start_date_7, req.params.id);
          var week_6_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_6,
            start_date_7,
            req.params.id
          );
          var week_6_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_6,
            start_date_7,
            req.params.id
          );

          var obj = {};
          obj.total = week_6_total;
          obj.passed = week_6_passed;
          obj.failed = week_6_failed;
          obj.title = "week 6";
          annual_report.push(obj);

          //week 7
          var week_7_total = await StatisticsService.getTotalReportsAnnual(start_date_7, start_date_8, req.params.id);
          var week_7_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_7,
            start_date_8,
            req.params.id
          );
          var week_7_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_7,
            start_date_8,
            req.params.id
          );

          var obj = {};
          obj.total = week_7_total;
          obj.passed = week_7_passed;
          obj.failed = week_7_failed;
          obj.title = "week 7";
          annual_report.push(obj);

          //week 8
          var week_8_total = await StatisticsService.getTotalReportsAnnual(start_date_8, start_date_9, req.params.id);
          var week_8_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_8,
            start_date_9,
            req.params.id
          );
          var week_8_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_8,
            start_date_9,
            req.params.id
          );

          var obj = {};
          obj.total = week_8_total;
          obj.passed = week_8_passed;
          obj.failed = week_8_failed;
          obj.title = "week 8";
          annual_report.push(obj);

          //week 9
          var week_9_total = await StatisticsService.getTotalReportsAnnual(start_date_9, start_date_10, req.params.id);
          var week_9_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_9,
            start_date_10,
            req.params.id
          );
          var week_9_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_9,
            start_date_10,
            req.params.id
          );

          var obj = {};
          obj.total = week_9_total;
          obj.passed = week_9_passed;
          obj.failed = week_9_failed;
          obj.title = "week 9";
          annual_report.push(obj);

          //week 10
          var week_10_total = await StatisticsService.getTotalReportsAnnual(
            start_date_10,
            start_date_11,
            req.params.id
          );
          var week_10_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_10,
            start_date_11,
            req.params.id
          );
          var week_10_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_10,
            start_date_11,
            req.params.id
          );

          var obj = {};
          obj.total = week_10_total;
          obj.passed = week_10_passed;
          obj.failed = week_10_failed;
          obj.title = "week 10";
          annual_report.push(obj);

          //week 11
          var week_11_total = await StatisticsService.getTotalReportsAnnual(
            start_date_11,
            start_date_12,
            req.params.id
          );
          var week_11_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_11,
            start_date_12,
            req.params.id
          );
          var week_11_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_11,
            start_date_12,
            req.params.id
          );

          var obj = {};
          obj.total = week_11_total;
          obj.passed = week_11_passed;
          obj.failed = week_11_failed;
          obj.title = "week 11";
          annual_report.push(obj);

          //week 12
          var week_12_total = await StatisticsService.getTotalReportsAnnual(
            start_date_12,
            end_date_annual,
            req.params.id
          );
          var week_12_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_12,
            end_date_annual,
            req.params.id
          );
          var week_12_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_12,
            end_date_annual,
            req.params.id
          );

          var obj = {};
          obj.total = week_12_total;
          obj.passed = week_12_passed;
          obj.failed = week_12_failed;
          obj.title = "week 12";
          annual_report.push(obj);

          break;
        case "180":
          var end_date_annual = new Date();
          var start_date_6 = new Date();
          var start_date_5 = new Date();
          var start_date_4 = new Date();
          var start_date_3 = new Date();
          var start_date_2 = new Date();
          var start_date_1 = new Date();

          var month = 30.0;
          start_date_6.setDate(start_date_6.getDate() - month);
          start_date_5.setDate(start_date_5.getDate() - 2 * month);
          start_date_4.setDate(start_date_4.getDate() - 3 * month);
          start_date_3.setDate(start_date_3.getDate() - 4 * month);
          start_date_2.setDate(start_date_2.getDate() - 5 * month);
          start_date_1.setDate(start_date_1.getDate() - 6 * month);

          //month 1
          var month_1_total = await StatisticsService.getTotalReportsAnnual(start_date_1, start_date_2, req.params.id);
          var month_1_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_1,
            start_date_2,
            req.params.id
          );
          var month_1_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_1,
            start_date_2,
            req.params.id
          );

          var obj = {};
          obj.total = month_1_total;
          obj.passed = month_1_passed;
          obj.failed = month_1_failed;
          obj.title = "month 1";
          annual_report.push(obj);

          //month 2
          var month_2_total = await StatisticsService.getTotalReportsAnnual(start_date_2, start_date_3, req.params.id);
          var month_2_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_2,
            start_date_3,
            req.params.id
          );
          var month_2_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_2,
            start_date_3,
            req.params.id
          );

          var obj = {};
          obj.total = month_2_total;
          obj.passed = month_2_passed;
          obj.failed = month_2_failed;
          obj.title = "month 2";
          annual_report.push(obj);

          //month 3
          var month_3_total = await StatisticsService.getTotalReportsAnnual(start_date_3, start_date_4, req.params.id);
          var month_3_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_3,
            start_date_4,
            req.params.id
          );
          var month_3_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_3,
            start_date_4,
            req.params.id
          );

          var obj = {};
          obj.total = month_3_total;
          obj.passed = month_3_passed;
          obj.failed = month_3_failed;
          obj.title = "month 3";
          annual_report.push(obj);

          //month 4
          var month_4_total = await StatisticsService.getTotalReportsAnnual(start_date_4, start_date_5, req.params.id);
          var month_4_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_4,
            start_date_5,
            req.params.id
          );
          var month_4_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_4,
            start_date_5,
            req.params.id
          );

          var obj = {};
          obj.total = month_4_total;
          obj.passed = month_4_passed;
          obj.failed = month_4_failed;
          obj.title = "month 4";
          annual_report.push(obj);

          //month 5
          var month_5_total = await StatisticsService.getTotalReportsAnnual(start_date_5, start_date_6, req.params.id);
          var month_5_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_5,
            start_date_6,
            req.params.id
          );
          var month_5_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_5,
            start_date_6,
            req.params.id
          );

          var obj = {};
          obj.total = month_5_total;
          obj.passed = month_5_passed;
          obj.failed = month_5_failed;
          obj.title = "month 5";
          annual_report.push(obj);

          //month 6
          var month_6_total = await StatisticsService.getTotalReportsAnnual(
            start_date_6,
            end_date_annual,
            req.params.id
          );
          var month_6_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_6,
            end_date_annual,
            req.params.id
          );
          var month_6_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_6,
            end_date_annual,
            req.params.id
          );

          var obj = {};
          obj.total = month_6_total;
          obj.passed = month_6_passed;
          obj.failed = month_6_failed;
          obj.title = "month 6";
          annual_report.push(obj);

          break;
        case "360":
        default:
          var end_date_annual = new Date();
          var start_date_12 = new Date();
          var start_date_11 = new Date();
          var start_date_10 = new Date();
          var start_date_9 = new Date();
          var start_date_8 = new Date();
          var start_date_7 = new Date();
          var start_date_6 = new Date();
          var start_date_5 = new Date();
          var start_date_4 = new Date();
          var start_date_3 = new Date();
          var start_date_2 = new Date();
          var start_date_1 = new Date();

          var month = 30.0;
          start_date_12.setDate(start_date_12.getDate() - month);
          start_date_11.setDate(start_date_11.getDate() - 2 * month);
          start_date_10.setDate(start_date_10.getDate() - 3 * month);
          start_date_9.setDate(start_date_9.getDate() - 4 * month);
          start_date_8.setDate(start_date_8.getDate() - 5 * month);
          start_date_7.setDate(start_date_7.getDate() - 6 * month);
          start_date_6.setDate(start_date_6.getDate() - 7 * month);
          start_date_5.setDate(start_date_5.getDate() - 8 * month);
          start_date_4.setDate(start_date_4.getDate() - 9 * month);
          start_date_3.setDate(start_date_3.getDate() - 10 * month);
          start_date_2.setDate(start_date_2.getDate() - 11 * month);
          start_date_1.setDate(start_date_1.getDate() - 12 * month);

          //month 1
          var month_1_total = await StatisticsService.getTotalReportsAnnual(start_date_1, start_date_2, req.params.id);
          var month_1_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_1,
            start_date_2,
            req.params.id
          );
          var month_1_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_1,
            start_date_2,
            req.params.id
          );

          var obj = {};
          obj.total = month_1_total;
          obj.passed = month_1_passed;
          obj.failed = month_1_failed;
          obj.title = "month 1";
          annual_report.push(obj);

          //month 2
          var month_2_total = await StatisticsService.getTotalReportsAnnual(start_date_2, start_date_3, req.params.id);
          var month_2_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_2,
            start_date_3,
            req.params.id
          );
          var month_2_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_2,
            start_date_3,
            req.params.id
          );

          var obj = {};
          obj.total = month_2_total;
          obj.passed = month_2_passed;
          obj.failed = month_2_failed;
          obj.title = "month 2";
          annual_report.push(obj);

          //month 3
          var month_3_total = await StatisticsService.getTotalReportsAnnual(start_date_3, start_date_4, req.params.id);
          var month_3_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_3,
            start_date_4,
            req.params.id
          );
          var month_3_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_3,
            start_date_4,
            req.params.id
          );

          var obj = {};
          obj.total = month_3_total;
          obj.passed = month_3_passed;
          obj.failed = month_3_failed;
          obj.title = "month 3";
          annual_report.push(obj);

          //month 4
          var month_4_total = await StatisticsService.getTotalReportsAnnual(start_date_4, start_date_5, req.params.id);
          var month_4_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_4,
            start_date_5,
            req.params.id
          );
          var month_4_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_4,
            start_date_5,
            req.params.id
          );

          var obj = {};
          obj.total = month_4_total;
          obj.passed = month_4_passed;
          obj.failed = month_4_failed;
          obj.title = "month 4";
          annual_report.push(obj);

          //month 5
          var month_5_total = await StatisticsService.getTotalReportsAnnual(start_date_5, start_date_6, req.params.id);
          var month_5_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_5,
            start_date_6,
            req.params.id
          );
          var month_5_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_5,
            start_date_6,
            req.params.id
          );

          var obj = {};
          obj.total = month_5_total;
          obj.passed = month_5_passed;
          obj.failed = month_5_failed;
          obj.title = "month 5";
          annual_report.push(obj);

          //month 6
          var month_6_total = await StatisticsService.getTotalReportsAnnual(start_date_6, start_date_7, req.params.id);
          var month_6_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_6,
            start_date_7,
            req.params.id
          );
          var month_6_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_6,
            start_date_7,
            req.params.id
          );

          var obj = {};
          obj.total = month_6_total;
          obj.passed = month_6_passed;
          obj.failed = month_6_failed;
          obj.title = "month 6";
          annual_report.push(obj);

          //month 7
          var month_7_total = await StatisticsService.getTotalReportsAnnual(start_date_7, start_date_8, req.params.id);
          var month_7_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_7,
            start_date_8,
            req.params.id
          );
          var month_7_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_7,
            start_date_8,
            req.params.id
          );

          var obj = {};
          obj.total = month_7_total;
          obj.passed = month_7_passed;
          obj.failed = month_7_failed;
          obj.title = "month 7";
          annual_report.push(obj);

          //month 8
          var month_8_total = await StatisticsService.getTotalReportsAnnual(start_date_8, start_date_9, req.params.id);
          var month_8_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_8,
            start_date_9,
            req.params.id
          );
          var month_8_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_8,
            start_date_9,
            req.params.id
          );

          var obj = {};
          obj.total = month_8_total;
          obj.passed = month_8_passed;
          obj.failed = month_8_failed;
          obj.title = "month 8";
          annual_report.push(obj);

          //month 9
          var month_9_total = await StatisticsService.getTotalReportsAnnual(start_date_9, start_date_10, req.params.id);
          var month_9_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_9,
            start_date_10,
            req.params.id
          );
          var month_9_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_9,
            start_date_10,
            req.params.id
          );

          var obj = {};
          obj.total = month_9_total;
          obj.passed = month_9_passed;
          obj.failed = month_9_failed;
          obj.title = "month 9";
          annual_report.push(obj);

          //month 10
          var month_10_total = await StatisticsService.getTotalReportsAnnual(
            start_date_10,
            start_date_11,
            req.params.id
          );
          var month_10_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_10,
            start_date_11,
            req.params.id
          );
          var month_10_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_10,
            start_date_11,
            req.params.id
          );

          var obj = {};
          obj.total = month_10_total;
          obj.passed = month_10_passed;
          obj.failed = month_10_failed;
          obj.title = "month 10";
          annual_report.push(obj);

          //month 11
          var month_11_total = await StatisticsService.getTotalReportsAnnual(
            start_date_11,
            start_date_12,
            req.params.id
          );
          var month_11_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_11,
            start_date_12,
            req.params.id
          );
          var month_11_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_11,
            start_date_12,
            req.params.id
          );

          var obj = {};
          obj.total = month_11_total;
          obj.passed = month_11_passed;
          obj.failed = month_11_failed;
          obj.title = "month 11";
          annual_report.push(obj);

          //month 12
          var month_12_total = await StatisticsService.getTotalReportsAnnual(
            start_date_12,
            end_date_annual,
            req.params.id
          );
          var month_12_passed = await StatisticsService.getTotalReportsPassedAnnual(
            start_date_12,
            end_date_annual,
            req.params.id
          );
          var month_12_failed = await StatisticsService.getTotalReportsFailedAnnual(
            start_date_12,
            end_date_annual,
            req.params.id
          );

          var obj = {};
          obj.total = month_12_total;
          obj.passed = month_12_passed;
          obj.failed = month_12_failed;
          obj.title = "month 12";
          annual_report.push(obj);

          break;
      }
    } else {
      switch (option) {
        case "current_week":
          var end_date = new Date();
          var start_date = new Date();

          var day_current = end_date.getDay();
          if (day_current == 0) {
            day_current = 7;
          }

          var counter = 0;
          while (day_current > 0) {
            if (counter > 0) {
              start_date = new Date(start_date.setDate(start_date.getDate() - 1));
            }
            start_date.setHours(0, 0, 0, 0);
            var minutes = start_date.getTimezoneOffset();
            start_date = start_date.getTime();
            start_date = start_date - minutes * 60 * 1000;
            start_date = new Date(start_date);

            var total = await StatisticsService.getTotalReportsAnnual(start_date, end_date, req.params.id);
            var passed = await StatisticsService.getTotalReportsPassedAnnual(start_date, end_date, req.params.id);
            var failed = await StatisticsService.getTotalReportsFailedAnnual(start_date, end_date, req.params.id);
            day_current = day_current - 1;

            var obj = {};
            obj.total = total;
            obj.passed = passed;
            obj.failed = failed;
            obj.title = dayNames[day_current];
            annual_report.push(obj);
            if (counter > 0) {
              end_date = new Date(end_date.setDate(end_date.getDate() - 1));
            }
            end_date.setHours(0, 0, 0, 0);
            var minutes = end_date.getTimezoneOffset();
            end_date = end_date.getTime();
            end_date = end_date - minutes * 60 * 1000;
            end_date = new Date(end_date);
            counter = counter + 1;
          }
          annual_report.reverse();
          break;
        case "current_month":
          var end_date = new Date();
          var start_date = new Date();

          var day = start_date.getDay();
          var diff = start_date.getDate() - day + (day == 0 ? -6 : 1);
          start_date = new Date(start_date.setDate(diff));
          start_date.setHours(0, 0, 0, 0);
          var minutes = start_date.getTimezoneOffset();
          start_date = start_date.getTime();
          start_date = start_date - minutes * 60 * 1000;
          start_date = new Date(start_date);

          var first_day_of_month = new Date();
          first_day_of_month = new Date(first_day_of_month.getFullYear(), first_day_of_month.getMonth(), 1);
          var minutes = first_day_of_month.getTimezoneOffset();
          first_day_of_month = first_day_of_month.getTime();
          first_day_of_month = first_day_of_month - minutes * 60 * 1000;
          first_day_of_month = new Date(first_day_of_month);

          var total = await StatisticsService.getTotalReportsAnnual(start_date, end_date, req.params.id);
          var passed = await StatisticsService.getTotalReportsPassedAnnual(start_date, end_date, req.params.id);
          var failed = await StatisticsService.getTotalReportsFailedAnnual(start_date, end_date, req.params.id);

          var obj = {};
          obj.total = total;
          obj.passed = passed;
          obj.failed = failed;
          annual_report.push(obj);

          while (start_date > first_day_of_month) {
            end_date = new Date(start_date);
            start_date = new Date(start_date.setDate(start_date.getDate() - 7));
            start_date.setHours(0, 0, 0, 0);
            start_date = new Date(start_date);
            var minutes = start_date.getTimezoneOffset();
            start_date = start_date.getTime();
            start_date = start_date - minutes * 60 * 1000;
            start_date = new Date(start_date);

            if (start_date < first_day_of_month) {
              start_date = first_day_of_month;
            }

            var total = await StatisticsService.getTotalReportsAnnual(start_date, end_date, req.params.id);
            var passed = await StatisticsService.getTotalReportsPassedAnnual(start_date, end_date, req.params.id);
            var failed = await StatisticsService.getTotalReportsFailedAnnual(start_date, end_date, req.params.id);

            var obj = {};
            obj.total = total;
            obj.passed = passed;
            obj.failed = failed;
            annual_report.push(obj);
          }

          annual_report.reverse();
          for (var week = 0; week < annual_report.length; week++) {
            annual_report[week].title = "week " + (week + 1);
          }

          break;
        case "current_year":
          var end_date = new Date();
          var start_date = new Date();
          start_date = new Date(start_date.getFullYear(), start_date.getMonth(), 1);
          var minutes = start_date.getTimezoneOffset();
          start_date = start_date.getTime();
          start_date = start_date - minutes * 60 * 1000;
          start_date = new Date(start_date);

          var total = await StatisticsService.getTotalReportsAnnual(start_date, end_date, req.params.id);
          var passed = await StatisticsService.getTotalReportsPassedAnnual(start_date, end_date, req.params.id);
          var failed = await StatisticsService.getTotalReportsFailedAnnual(start_date, end_date, req.params.id);

          var obj = {};
          obj.total = total;
          obj.passed = passed;
          obj.failed = failed;

          var month_current = end_date.getMonth();
          obj.title = monthNames[month_current];
          annual_report.push(obj);

          var first_date_of_year = new Date(new Date().getFullYear(), 0, 1);
          var minutes = first_date_of_year.getTimezoneOffset();
          first_date_of_year = first_date_of_year.getTime();
          first_date_of_year = first_date_of_year - minutes * 60 * 1000;
          first_date_of_year = new Date(first_date_of_year);

          while (start_date > first_date_of_year) {
            end_date = new Date(start_date);
            start_date = new Date(start_date.setMonth(start_date.getMonth() - 1));
            start_date.setHours(0, 0, 0, 0);

            start_date = new Date(start_date);

            var minutes = start_date.getTimezoneOffset();
            start_date = start_date.getTime();
            start_date = start_date - minutes * 60 * 1000;
            start_date = new Date(start_date);

            var total = await StatisticsService.getTotalReportsAnnual(start_date, end_date, req.params.id);
            var passed = await StatisticsService.getTotalReportsPassedAnnual(start_date, end_date, req.params.id);
            var failed = await StatisticsService.getTotalReportsFailedAnnual(start_date, end_date, req.params.id);

            var obj = {};
            obj.total = total;
            obj.passed = passed;
            obj.failed = failed;

            var month_current = month_current - 1;
            obj.title = monthNames[month_current];
            annual_report.push(obj);
          }
          annual_report.reverse();

          break;
      }
    }

    var statistics = {};
    statistics.total_data = {};
    statistics.total_data.total_testcases = {};
    statistics.total_data.total_testcases.value = totalTestcases;
    statistics.total_data.total_testcases.percentage = totalTestcasesPercentage;

    statistics.total_data.total_reports = {};
    statistics.total_data.total_reports.value = totalReports;
    statistics.total_data.total_reports.percentage = totalReportsPercentage;
    statistics.total_data.total_reports.ratio = ratio;

    statistics.total_data.total_passed_reports = {};
    statistics.total_data.total_passed_reports.value = totalsReportsPassed;
    statistics.total_data.total_passed_reports.percentage = totalReportsPassedPercentage;
    statistics.total_data.total_passed_reports.ratio = ratioPassedReports;

    statistics.total_data.total_failed_reports = {};
    statistics.total_data.total_failed_reports.value = totalsReportsFailed;
    statistics.total_data.total_failed_reports.percentage = totalReportsFailedPercentage;
    statistics.total_data.total_failed_reports.ratio = ratioFailedReports;

    statistics.most_active_testcases = most_active_testcases;

    statistics.most_testcases_failed = most_testcases_failed;

    statistics.most_user_reports = most_user_reports;

    statistics.most_user_testcases = most_user_testcases;

    if (versions) {
      statistics.most_version_failed = most_version_failed.slice(0, 5);
    }

    // statistics.annual_report_old = annual_report_old.reverse();
    statistics.annual_report = annual_report;

    return res.status(200).json(statistics);
  },
  getGlobalStatistics: async function(req, res) {
    var days = req.query.days;
    var option = req.query.option;
    var end_date = null;
    var start_date = null;
    var prev_start_date = null;

    if (days) {
      var end_date = new Date();
      var start_date = new Date();
      var prev_start_date = new Date();
      start_date.setDate(start_date.getDate() - days);
      prev_start_date.setDate(start_date.getDate() - days);
    } else {
      if (option) {
        switch (option) {
          case "current_week":
            var end_date = new Date();
            var start_date = new Date();

            var day = start_date.getDay(),
              diff = start_date.getDate() - day + (day == 0 ? -6 : 1);
            start_date = new Date(start_date.setDate(diff));
            start_date.setHours(0, 0, 0, 0);
            var minutes = start_date.getTimezoneOffset();
            start_date = start_date.getTime();
            start_date = start_date - minutes * 60 * 1000;
            start_date = new Date(start_date);

            var prev_start_date = new Date();
            prev_start_date.setDate(start_date.getDate() - 7);
            prev_start_date.setHours(0, 0, 0, 0);
            var minutes = prev_start_date.getTimezoneOffset();
            prev_start_date = prev_start_date.getTime();
            prev_start_date = prev_start_date - minutes * 60 * 1000;
            prev_start_date = new Date(prev_start_date);

            break;
        }
      }
    }

    var totalTestcases = await StatisticsService.getTotalTestcases(start_date, end_date);
    var totalTestcasesPrevious = await StatisticsService.getTotalTestcases(prev_start_date, start_date);
    if (totalTestcasesPrevious > 0 && days) {
      var totalTestcasesPercentage = Math.round(((totalTestcases / totalTestcasesPrevious) * 100 - 100) * 100) / 100;
    } else {
      var totalTestcasesPercentage = null;
    }

    var totalReports = await StatisticsService.getTotalReports(start_date, end_date);
    var totalReportsPrevious = await StatisticsService.getTotalReports(prev_start_date, start_date);

    if (totalReportsPrevious > 0 && days) {
      var totalReportsPercentage = Math.round(((totalReports / totalReportsPrevious) * 100 - 100) * 100) / 100;
    } else {
      var totalReportsPercentage = null;
    }

    if (totalTestcases && totalReports) {
      var ratio = Math.round((totalReports / totalTestcases) * 100) / 100;
    } else {
      var ratio = null;
    }

    var totalsReportsPassed = await StatisticsService.getTotalReportsPassed(start_date, end_date);
    var totalsReportsPassedPrevious = await StatisticsService.getTotalReportsPassed(prev_start_date, start_date);
    if (totalsReportsPassedPrevious > 0 && days) {
      var totalReportsPassedPercentage =
        Math.round(((totalsReportsPassed / totalsReportsPassedPrevious) * 100 - 100) * 100) / 100;
    } else {
      var totalReportsPassedPercentage = null;
    }
    if (totalReports && totalsReportsPassed) {
      var ratioPassedReports = Math.round((totalsReportsPassed / totalReports) * 100 * 100) / 100;
    } else {
      var ratioPassedReports = null;
    }

    var totalsReportsFailed = await StatisticsService.getTotalReportsFailed(start_date, end_date);
    var totalsReportsFailedPrevious = await StatisticsService.getTotalReportsFailed(prev_start_date, start_date);
    if (totalsReportsFailedPrevious > 0 && days) {
      var totalReportsFailedPercentage =
        Math.round(((totalsReportsFailed / totalsReportsFailedPrevious) * 100 - 100) * 100) / 100;
    } else {
      var totalReportsFailedPercentage = null;
    }
    if (totalReports && totalsReportsFailed) {
      var ratioFailedReports = Math.round((totalsReportsFailed / totalReports) * 100 * 100) / 100;
    } else {
      var ratioFailedReports = null;
    }

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

    if (days) {
      switch (days) {
        case "3":
          var end_date_annual = new Date();
          var start_date_3 = new Date();
          var start_date_2 = new Date();
          var start_date_1 = new Date();

          start_date_3.setDate(start_date_3.getDate() - 1);
          start_date_2.setDate(start_date_2.getDate() - 2);
          start_date_1.setDate(start_date_1.getDate() - 3);

          //day 1
          var day_1_total = await StatisticsService.getTotalReportsAnnual(start_date_1, start_date_2);
          var day_1_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_1, start_date_2);
          var day_1_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_1, start_date_2);

          var obj = {};
          obj.total = day_1_total;
          obj.passed = day_1_passed;
          obj.failed = day_1_failed;
          obj.title = "day 1";
          annual_report.push(obj);

          //day 2
          var day_2_total = await StatisticsService.getTotalReportsAnnual(start_date_2, start_date_3);
          var day_2_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_2, start_date_3);
          var day_2_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_2, start_date_3);

          var obj = {};
          obj.total = day_2_total;
          obj.passed = day_2_passed;
          obj.failed = day_2_failed;
          obj.title = "day 2";
          annual_report.push(obj);

          //day 3
          var day_1_total = await StatisticsService.getTotalReportsAnnual(start_date_3, end_date_annual);
          var day_1_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_3, end_date_annual);
          var day_1_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_3, end_date_annual);

          var obj = {};
          obj.total = day_1_total;
          obj.passed = day_1_passed;
          obj.failed = day_1_failed;
          obj.title = "day 3";
          annual_report.push(obj);

          break;
        case "7":
          var end_date_annual = new Date();
          var start_date_7 = new Date();
          var start_date_6 = new Date();
          var start_date_5 = new Date();
          var start_date_4 = new Date();
          var start_date_3 = new Date();
          var start_date_2 = new Date();
          var start_date_1 = new Date();

          start_date_7.setDate(start_date_4.getDate() - 1);
          start_date_6.setDate(start_date_4.getDate() - 2);
          start_date_5.setDate(start_date_4.getDate() - 3);
          start_date_4.setDate(start_date_4.getDate() - 4);
          start_date_3.setDate(start_date_3.getDate() - 5);
          start_date_2.setDate(start_date_2.getDate() - 6);
          start_date_1.setDate(start_date_1.getDate() - 7);

          //day 1
          var day_1_total = await StatisticsService.getTotalReportsAnnual(start_date_1, start_date_2);
          var day_1_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_1, start_date_2);
          var day_1_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_1, start_date_2);

          var obj = {};
          obj.total = day_1_total;
          obj.passed = day_1_passed;
          obj.failed = day_1_failed;
          obj.title = "day 1";
          annual_report.push(obj);

          //day 2
          var day_2_total = await StatisticsService.getTotalReportsAnnual(start_date_2, start_date_3);
          var day_2_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_2, start_date_3);
          var day_2_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_2, start_date_3);

          var obj = {};
          obj.total = day_2_total;
          obj.passed = day_2_passed;
          obj.failed = day_2_failed;
          obj.title = "day 2";
          annual_report.push(obj);

          //day 3
          var day_3_total = await StatisticsService.getTotalReportsAnnual(start_date_3, start_date_4);
          var day_3_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_3, start_date_4);
          var day_3_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_3, start_date_4);

          var obj = {};
          obj.total = day_3_total;
          obj.passed = day_3_passed;
          obj.failed = day_3_failed;
          obj.title = "day 3";
          annual_report.push(obj);

          //day 4
          var day_4_total = await StatisticsService.getTotalReportsAnnual(start_date_4, start_date_5);
          var day_4_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_4, start_date_5);
          var day_4_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_4, start_date_5);

          var obj = {};
          obj.total = day_4_total;
          obj.passed = day_4_passed;
          obj.failed = day_4_failed;
          obj.title = "day 4";
          annual_report.push(obj);
          //day 5
          var day_5_total = await StatisticsService.getTotalReportsAnnual(start_date_5, start_date_6);
          var day_5_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_5, start_date_6);
          var day_5_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_5, start_date_6);

          var obj = {};
          obj.total = day_5_total;
          obj.passed = day_5_passed;
          obj.failed = day_5_failed;
          obj.title = "day 5";
          annual_report.push(obj);

          //day 6
          var day_6_total = await StatisticsService.getTotalReportsAnnual(start_date_6, start_date_7);
          var day_6_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_6, start_date_7);
          var day_6_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_6, start_date_7);

          var obj = {};
          obj.total = day_6_total;
          obj.passed = day_6_passed;
          obj.failed = day_6_failed;
          obj.title = "day 6";
          annual_report.push(obj);

          //day 7
          var day_7_total = await StatisticsService.getTotalReportsAnnual(start_date_7, end_date_annual);
          var day_7_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_7, end_date_annual);
          var day_7_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_7, end_date_annual);

          var obj = {};
          obj.total = day_7_total;
          obj.passed = day_7_passed;
          obj.failed = day_7_failed;
          obj.title = "day 7";
          annual_report.push(obj);
          break;

        case "30":
          var end_date_annual = new Date();
          var start_date_4 = new Date();
          var start_date_3 = new Date();
          var start_date_2 = new Date();
          var start_date_1 = new Date();

          var week = 30.0 / 4.0;
          start_date_4.setDate(start_date_4.getDate() - week);
          start_date_3.setDate(start_date_3.getDate() - 2 * week);
          start_date_2.setDate(start_date_2.getDate() - 3 * week);
          start_date_1.setDate(start_date_1.getDate() - 4 * week);

          //week 1
          var week_1_total = await StatisticsService.getTotalReportsAnnual(start_date_1, start_date_2);
          var week_1_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_1, start_date_2);
          var week_1_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_1, start_date_2);

          var obj = {};
          obj.total = week_1_total;
          obj.passed = week_1_passed;
          obj.failed = week_1_failed;
          obj.title = "week 1";
          annual_report.push(obj);

          //week 2
          var week_2_total = await StatisticsService.getTotalReportsAnnual(start_date_2, start_date_3);
          var week_2_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_2, start_date_3);
          var week_2_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_2, start_date_3);

          var obj = {};
          obj.total = week_2_total;
          obj.passed = week_2_passed;
          obj.failed = week_2_failed;
          obj.title = "week 2";
          annual_report.push(obj);

          //week 3
          var week_3_total = await StatisticsService.getTotalReportsAnnual(start_date_3, start_date_4);
          var week_3_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_3, start_date_4);
          var week_3_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_3, start_date_4);

          var obj = {};
          obj.total = week_3_total;
          obj.passed = week_3_passed;
          obj.failed = week_3_failed;
          obj.title = "week 3";
          annual_report.push(obj);

          //week 4
          var week_4_total = await StatisticsService.getTotalReportsAnnual(start_date_4, end_date_annual);
          var week_4_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_4, end_date_annual);
          var week_4_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_4, end_date_annual);

          var obj = {};
          obj.total = week_4_total;
          obj.passed = week_4_passed;
          obj.failed = week_4_failed;
          obj.title = "week 4";
          annual_report.push(obj);
          break;

        case "90":
          var end_date_annual = new Date();
          var start_date_12 = new Date();
          var start_date_11 = new Date();
          var start_date_10 = new Date();
          var start_date_9 = new Date();
          var start_date_8 = new Date();
          var start_date_7 = new Date();
          var start_date_6 = new Date();
          var start_date_5 = new Date();
          var start_date_4 = new Date();
          var start_date_3 = new Date();
          var start_date_2 = new Date();
          var start_date_1 = new Date();

          var week = 30.0 / 4.0;
          start_date_12.setDate(start_date_12.getDate() - week);
          start_date_11.setDate(start_date_11.getDate() - 2 * week);
          start_date_10.setDate(start_date_10.getDate() - 3 * week);
          start_date_9.setDate(start_date_9.getDate() - 4 * week);
          start_date_8.setDate(start_date_8.getDate() - 5 * week);
          start_date_7.setDate(start_date_7.getDate() - 6 * week);
          start_date_6.setDate(start_date_6.getDate() - 7 * week);
          start_date_5.setDate(start_date_5.getDate() - 8 * week);
          start_date_4.setDate(start_date_4.getDate() - 9 * week);
          start_date_3.setDate(start_date_3.getDate() - 10 * week);
          start_date_2.setDate(start_date_2.getDate() - 11 * week);
          start_date_1.setDate(start_date_1.getDate() - 12 * week);

          //week 1
          var week_1_total = await StatisticsService.getTotalReportsAnnual(start_date_1, start_date_2);
          var week_1_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_1, start_date_2);
          var week_1_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_1, start_date_2);

          var obj = {};
          obj.total = week_1_total;
          obj.passed = week_1_passed;
          obj.failed = week_1_failed;
          obj.title = "week 1";
          annual_report.push(obj);

          //week 2
          var week_2_total = await StatisticsService.getTotalReportsAnnual(start_date_2, start_date_3);
          var week_2_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_2, start_date_3);
          var week_2_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_2, start_date_3);

          var obj = {};
          obj.total = week_2_total;
          obj.passed = week_2_passed;
          obj.failed = week_2_failed;
          obj.title = "week 2";
          annual_report.push(obj);

          //week 3
          var week_3_total = await StatisticsService.getTotalReportsAnnual(start_date_3, start_date_4);
          var week_3_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_3, start_date_4);
          var week_3_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_3, start_date_4);

          var obj = {};
          obj.total = week_3_total;
          obj.passed = week_3_passed;
          obj.failed = week_3_failed;
          obj.title = "week 3";
          annual_report.push(obj);

          //week 4
          var week_4_total = await StatisticsService.getTotalReportsAnnual(start_date_4, start_date_5);
          var week_4_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_4, start_date_5);
          var week_4_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_4, start_date_5);

          var obj = {};
          obj.total = week_4_total;
          obj.passed = week_4_passed;
          obj.failed = week_4_failed;
          obj.title = "week 4";
          annual_report.push(obj);

          //week 5
          var week_5_total = await StatisticsService.getTotalReportsAnnual(start_date_5, start_date_6);
          var week_5_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_5, start_date_6);
          var week_5_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_5, start_date_6);

          var obj = {};
          obj.total = week_5_total;
          obj.passed = week_5_passed;
          obj.failed = week_5_failed;
          obj.title = "week 5";
          annual_report.push(obj);

          //week 6
          var week_6_total = await StatisticsService.getTotalReportsAnnual(start_date_6, start_date_7);
          var week_6_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_6, start_date_7);
          var week_6_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_6, start_date_7);

          var obj = {};
          obj.total = week_6_total;
          obj.passed = week_6_passed;
          obj.failed = week_6_failed;
          obj.title = "week 6";
          annual_report.push(obj);

          //week 7
          var week_7_total = await StatisticsService.getTotalReportsAnnual(start_date_7, start_date_8);
          var week_7_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_7, start_date_8);
          var week_7_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_7, start_date_8);

          var obj = {};
          obj.total = week_7_total;
          obj.passed = week_7_passed;
          obj.failed = week_7_failed;
          obj.title = "week 7";
          annual_report.push(obj);

          //week 8
          var week_8_total = await StatisticsService.getTotalReportsAnnual(start_date_8, start_date_9);
          var week_8_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_8, start_date_9);
          var week_8_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_8, start_date_9);

          var obj = {};
          obj.total = week_8_total;
          obj.passed = week_8_passed;
          obj.failed = week_8_failed;
          obj.title = "week 8";
          annual_report.push(obj);

          //week 9
          var week_9_total = await StatisticsService.getTotalReportsAnnual(start_date_9, start_date_10);
          var week_9_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_9, start_date_10);
          var week_9_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_9, start_date_10);

          var obj = {};
          obj.total = week_9_total;
          obj.passed = week_9_passed;
          obj.failed = week_9_failed;
          obj.title = "week 9";
          annual_report.push(obj);

          //week 10
          var week_10_total = await StatisticsService.getTotalReportsAnnual(start_date_10, start_date_11);
          var week_10_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_10, start_date_11);
          var week_10_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_10, start_date_11);

          var obj = {};
          obj.total = week_10_total;
          obj.passed = week_10_passed;
          obj.failed = week_10_failed;
          obj.title = "week 10";
          annual_report.push(obj);

          //week 11
          var week_11_total = await StatisticsService.getTotalReportsAnnual(start_date_11, start_date_12);
          var week_11_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_11, start_date_12);
          var week_11_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_11, start_date_12);

          var obj = {};
          obj.total = week_11_total;
          obj.passed = week_11_passed;
          obj.failed = week_11_failed;
          obj.title = "week 11";
          annual_report.push(obj);

          //week 12
          var week_12_total = await StatisticsService.getTotalReportsAnnual(start_date_12, end_date_annual);
          var week_12_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_12, end_date_annual);
          var week_12_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_12, end_date_annual);

          var obj = {};
          obj.total = week_12_total;
          obj.passed = week_12_passed;
          obj.failed = week_12_failed;
          obj.title = "week 12";
          annual_report.push(obj);

          break;
        case "180":
          var end_date_annual = new Date();
          var start_date_6 = new Date();
          var start_date_5 = new Date();
          var start_date_4 = new Date();
          var start_date_3 = new Date();
          var start_date_2 = new Date();
          var start_date_1 = new Date();

          var month = 30.0;
          start_date_6.setDate(start_date_6.getDate() - month);
          start_date_5.setDate(start_date_5.getDate() - 2 * month);
          start_date_4.setDate(start_date_4.getDate() - 3 * month);
          start_date_3.setDate(start_date_3.getDate() - 4 * month);
          start_date_2.setDate(start_date_2.getDate() - 5 * month);
          start_date_1.setDate(start_date_1.getDate() - 6 * month);

          //month 1
          var month_1_total = await StatisticsService.getTotalReportsAnnual(start_date_1, start_date_2);
          var month_1_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_1, start_date_2);
          var month_1_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_1, start_date_2);

          var obj = {};
          obj.total = month_1_total;
          obj.passed = month_1_passed;
          obj.failed = month_1_failed;
          obj.title = "month 1";
          annual_report.push(obj);

          //month 2
          var month_2_total = await StatisticsService.getTotalReportsAnnual(start_date_2, start_date_3);
          var month_2_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_2, start_date_3);
          var month_2_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_2, start_date_3);

          var obj = {};
          obj.total = month_2_total;
          obj.passed = month_2_passed;
          obj.failed = month_2_failed;
          obj.title = "month 2";
          annual_report.push(obj);

          //month 3
          var month_3_total = await StatisticsService.getTotalReportsAnnual(start_date_3, start_date_4);
          var month_3_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_3, start_date_4);
          var month_3_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_3, start_date_4);

          var obj = {};
          obj.total = month_3_total;
          obj.passed = month_3_passed;
          obj.failed = month_3_failed;
          obj.title = "month 3";
          annual_report.push(obj);

          //month 4
          var month_4_total = await StatisticsService.getTotalReportsAnnual(start_date_4, start_date_5);
          var month_4_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_4, start_date_5);
          var month_4_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_4, start_date_5);

          var obj = {};
          obj.total = month_4_total;
          obj.passed = month_4_passed;
          obj.failed = month_4_failed;
          obj.title = "month 4";
          annual_report.push(obj);

          //month 5
          var month_5_total = await StatisticsService.getTotalReportsAnnual(start_date_5, start_date_6);
          var month_5_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_5, start_date_6);
          var month_5_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_5, start_date_6);

          var obj = {};
          obj.total = month_5_total;
          obj.passed = month_5_passed;
          obj.failed = month_5_failed;
          obj.title = "month 5";
          annual_report.push(obj);

          //month 6
          var month_6_total = await StatisticsService.getTotalReportsAnnual(start_date_6, end_date_annual);
          var month_6_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_6, end_date_annual);
          var month_6_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_6, end_date_annual);

          var obj = {};
          obj.total = month_6_total;
          obj.passed = month_6_passed;
          obj.failed = month_6_failed;
          obj.title = "month 6";
          annual_report.push(obj);

          break;
        case "360":
        default:
          var end_date_annual = new Date();
          var start_date_12 = new Date();
          var start_date_11 = new Date();
          var start_date_10 = new Date();
          var start_date_9 = new Date();
          var start_date_8 = new Date();
          var start_date_7 = new Date();
          var start_date_6 = new Date();
          var start_date_5 = new Date();
          var start_date_4 = new Date();
          var start_date_3 = new Date();
          var start_date_2 = new Date();
          var start_date_1 = new Date();

          var month = 30.0;
          start_date_12.setDate(start_date_12.getDate() - month);
          start_date_11.setDate(start_date_11.getDate() - 2 * month);
          start_date_10.setDate(start_date_10.getDate() - 3 * month);
          start_date_9.setDate(start_date_9.getDate() - 4 * month);
          start_date_8.setDate(start_date_8.getDate() - 5 * month);
          start_date_7.setDate(start_date_7.getDate() - 6 * month);
          start_date_6.setDate(start_date_6.getDate() - 7 * month);
          start_date_5.setDate(start_date_5.getDate() - 8 * month);
          start_date_4.setDate(start_date_4.getDate() - 9 * month);
          start_date_3.setDate(start_date_3.getDate() - 10 * month);
          start_date_2.setDate(start_date_2.getDate() - 11 * month);
          start_date_1.setDate(start_date_1.getDate() - 12 * month);

          //month 1
          var month_1_total = await StatisticsService.getTotalReportsAnnual(start_date_1, start_date_2);
          var month_1_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_1, start_date_2);
          var month_1_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_1, start_date_2);

          var obj = {};
          obj.total = month_1_total;
          obj.passed = month_1_passed;
          obj.failed = month_1_failed;
          obj.title = "month 1";
          annual_report.push(obj);

          //month 2
          var month_2_total = await StatisticsService.getTotalReportsAnnual(start_date_2, start_date_3);
          var month_2_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_2, start_date_3);
          var month_2_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_2, start_date_3);

          var obj = {};
          obj.total = month_2_total;
          obj.passed = month_2_passed;
          obj.failed = month_2_failed;
          obj.title = "month 2";
          annual_report.push(obj);

          //month 3
          var month_3_total = await StatisticsService.getTotalReportsAnnual(start_date_3, start_date_4);
          var month_3_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_3, start_date_4);
          var month_3_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_3, start_date_4);

          var obj = {};
          obj.total = month_3_total;
          obj.passed = month_3_passed;
          obj.failed = month_3_failed;
          obj.title = "month 3";
          annual_report.push(obj);

          //month 4
          var month_4_total = await StatisticsService.getTotalReportsAnnual(start_date_4, start_date_5);
          var month_4_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_4, start_date_5);
          var month_4_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_4, start_date_5);

          var obj = {};
          obj.total = month_4_total;
          obj.passed = month_4_passed;
          obj.failed = month_4_failed;
          obj.title = "month 4";
          annual_report.push(obj);

          //month 5
          var month_5_total = await StatisticsService.getTotalReportsAnnual(start_date_5, start_date_6);
          var month_5_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_5, start_date_6);
          var month_5_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_5, start_date_6);

          var obj = {};
          obj.total = month_5_total;
          obj.passed = month_5_passed;
          obj.failed = month_5_failed;
          obj.title = "month 5";
          annual_report.push(obj);

          //month 6
          var month_6_total = await StatisticsService.getTotalReportsAnnual(start_date_6, start_date_7);
          var month_6_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_6, start_date_7);
          var month_6_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_6, start_date_7);

          var obj = {};
          obj.total = month_6_total;
          obj.passed = month_6_passed;
          obj.failed = month_6_failed;
          obj.title = "month 6";
          annual_report.push(obj);

          //month 7
          var month_7_total = await StatisticsService.getTotalReportsAnnual(start_date_7, start_date_8);
          var month_7_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_7, start_date_8);
          var month_7_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_7, start_date_8);

          var obj = {};
          obj.total = month_7_total;
          obj.passed = month_7_passed;
          obj.failed = month_7_failed;
          obj.title = "month 7";
          annual_report.push(obj);

          //month 8
          var month_8_total = await StatisticsService.getTotalReportsAnnual(start_date_8, start_date_9);
          var month_8_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_8, start_date_9);
          var month_8_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_8, start_date_9);

          var obj = {};
          obj.total = month_8_total;
          obj.passed = month_8_passed;
          obj.failed = month_8_failed;
          obj.title = "month 8";
          annual_report.push(obj);

          //month 9
          var month_9_total = await StatisticsService.getTotalReportsAnnual(start_date_9, start_date_10);
          var month_9_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_9, start_date_10);
          var month_9_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_9, start_date_10);

          var obj = {};
          obj.total = month_9_total;
          obj.passed = month_9_passed;
          obj.failed = month_9_failed;
          obj.title = "month 9";
          annual_report.push(obj);

          //month 10
          var month_10_total = await StatisticsService.getTotalReportsAnnual(start_date_10, start_date_11);
          var month_10_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_10, start_date_11);
          var month_10_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_10, start_date_11);

          var obj = {};
          obj.total = month_10_total;
          obj.passed = month_10_passed;
          obj.failed = month_10_failed;
          obj.title = "month 10";
          annual_report.push(obj);

          //month 11
          var month_11_total = await StatisticsService.getTotalReportsAnnual(start_date_11, start_date_12);
          var month_11_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_11, start_date_12);
          var month_11_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_11, start_date_12);

          var obj = {};
          obj.total = month_11_total;
          obj.passed = month_11_passed;
          obj.failed = month_11_failed;
          obj.title = "month 11";
          annual_report.push(obj);

          //month 12
          var month_12_total = await StatisticsService.getTotalReportsAnnual(start_date_12, end_date_annual);
          var month_12_passed = await StatisticsService.getTotalReportsPassedAnnual(start_date_12, end_date_annual);
          var month_12_failed = await StatisticsService.getTotalReportsFailedAnnual(start_date_12, end_date_annual);

          var obj = {};
          obj.total = month_12_total;
          obj.passed = month_12_passed;
          obj.failed = month_12_failed;
          obj.title = "month 12";
          annual_report.push(obj);

          break;
      }
    } else {
      switch (option) {
        case "current_week":
          var end_date = new Date();
          var start_date = new Date();

          var day_current = end_date.getDay();
          if (day_current == 0) {
            day_current = 7;
          }

          var counter = 0;
          while (day_current > 0) {
            if (counter > 0) {
              start_date = new Date(start_date.setDate(start_date.getDate() - 1));
            }
            start_date.setHours(0, 0, 0, 0);
            var minutes = start_date.getTimezoneOffset();
            start_date = start_date.getTime();
            start_date = start_date - minutes * 60 * 1000;
            start_date = new Date(start_date);

            var total = await StatisticsService.getTotalReportsAnnual(start_date, end_date);
            var passed = await StatisticsService.getTotalReportsPassedAnnual(start_date, end_date);
            var failed = await StatisticsService.getTotalReportsFailedAnnual(start_date, end_date);
            day_current = day_current - 1;

            var obj = {};
            obj.total = total;
            obj.passed = passed;
            obj.failed = failed;
            obj.title = dayNames[day_current];
            annual_report.push(obj);
            if (counter > 0) {
              end_date = new Date(end_date.setDate(end_date.getDate() - 1));
            }
            end_date.setHours(0, 0, 0, 0);
            var minutes = end_date.getTimezoneOffset();
            end_date = end_date.getTime();
            end_date = end_date - minutes * 60 * 1000;
            end_date = new Date(end_date);
            counter = counter + 1;
          }
          break;
        case "current_month":
          var end_date = new Date();
          var start_date = new Date();

          var day = start_date.getDay();
          var diff = start_date.getDate() - day + (day == 0 ? -6 : 1);
          start_date = new Date(start_date.setDate(diff));
          start_date.setHours(0, 0, 0, 0);
          var minutes = start_date.getTimezoneOffset();
          start_date = start_date.getTime();
          start_date = start_date - minutes * 60 * 1000;
          start_date = new Date(start_date);

          var first_day_of_month = new Date();
          first_day_of_month = new Date(first_day_of_month.getFullYear(), first_day_of_month.getMonth(), 1);
          var minutes = first_day_of_month.getTimezoneOffset();
          first_day_of_month = first_day_of_month.getTime();
          first_day_of_month = first_day_of_month - minutes * 60 * 1000;
          first_day_of_month = new Date(first_day_of_month);

          var total = await StatisticsService.getTotalReportsAnnual(start_date, end_date);
          var passed = await StatisticsService.getTotalReportsPassedAnnual(start_date, end_date);
          var failed = await StatisticsService.getTotalReportsFailedAnnual(start_date, end_date);

          var obj = {};
          obj.total = total;
          obj.passed = passed;
          obj.failed = failed;
          annual_report.push(obj);

          while (start_date > first_day_of_month) {
            end_date = new Date(start_date);
            start_date = new Date(start_date.setDate(start_date.getDate() - 7));
            start_date.setHours(0, 0, 0, 0);
            start_date = new Date(start_date);
            var minutes = start_date.getTimezoneOffset();
            start_date = start_date.getTime();
            start_date = start_date - minutes * 60 * 1000;
            start_date = new Date(start_date);

            if (start_date < first_day_of_month) {
              start_date = first_day_of_month;
            }

            var total = await StatisticsService.getTotalReportsAnnual(start_date, end_date);
            var passed = await StatisticsService.getTotalReportsPassedAnnual(start_date, end_date);
            var failed = await StatisticsService.getTotalReportsFailedAnnual(start_date, end_date);

            var obj = {};
            obj.total = total;
            obj.passed = passed;
            obj.failed = failed;
            annual_report.push(obj);
          }

          annual_report.reverse();
          for (var week = 0; week < annual_report.length; week++) {
            annual_report[week].title = "week " + (week + 1);
          }

          break;
        case "current_year":
          var end_date = new Date();
          var start_date = new Date();
          start_date = new Date(start_date.getFullYear(), start_date.getMonth(), 1);
          var minutes = start_date.getTimezoneOffset();
          start_date = start_date.getTime();
          start_date = start_date - minutes * 60 * 1000;
          start_date = new Date(start_date);

          var total = await StatisticsService.getTotalReportsAnnual(start_date, end_date);
          var passed = await StatisticsService.getTotalReportsPassedAnnual(start_date, end_date);
          var failed = await StatisticsService.getTotalReportsFailedAnnual(start_date, end_date);

          var obj = {};
          obj.total = total;
          obj.passed = passed;
          obj.failed = failed;

          var month_current = end_date.getMonth();
          obj.title = monthNames[month_current];
          annual_report.push(obj);

          var first_date_of_year = new Date(new Date().getFullYear(), 0, 1);
          var minutes = first_date_of_year.getTimezoneOffset();
          first_date_of_year = first_date_of_year.getTime();
          first_date_of_year = first_date_of_year - minutes * 60 * 1000;
          first_date_of_year = new Date(first_date_of_year);

          while (start_date > first_date_of_year) {
            end_date = new Date(start_date);
            start_date = new Date(start_date.setMonth(start_date.getMonth() - 1));
            start_date.setHours(0, 0, 0, 0);

            start_date = new Date(start_date);

            var minutes = start_date.getTimezoneOffset();
            start_date = start_date.getTime();
            start_date = start_date - minutes * 60 * 1000;
            start_date = new Date(start_date);

            var total = await StatisticsService.getTotalReportsAnnual(start_date, end_date);
            var passed = await StatisticsService.getTotalReportsPassedAnnual(start_date, end_date);
            var failed = await StatisticsService.getTotalReportsFailedAnnual(start_date, end_date);

            var obj = {};
            obj.total = total;
            obj.passed = passed;
            obj.failed = failed;

            var month_current = month_current - 1;
            obj.title = monthNames[month_current];
            annual_report.push(obj);
          }

          break;
      }
    }

    var statistics = {};
    statistics.total_data = {};
    statistics.total_data.total_testcases = {};
    statistics.total_data.total_testcases.value = totalTestcases;
    statistics.total_data.total_testcases.percentage = totalTestcasesPercentage;

    statistics.total_data.total_reports = {};
    statistics.total_data.total_reports.value = totalReports;
    statistics.total_data.total_reports.percentage = totalReportsPercentage;
    statistics.total_data.total_reports.ratio = ratio;

    statistics.total_data.total_passed_reports = {};
    statistics.total_data.total_passed_reports.value = totalsReportsPassed;
    statistics.total_data.total_passed_reports.percentage = totalReportsPassedPercentage;
    statistics.total_data.total_passed_reports.ratio = ratioPassedReports;

    statistics.total_data.total_failed_reports = {};
    statistics.total_data.total_failed_reports.value = totalsReportsFailed;
    statistics.total_data.total_failed_reports.percentage = totalReportsFailedPercentage;
    statistics.total_data.total_failed_reports.ratio = ratioFailedReports;

    statistics.most_active_projects = most_active_projects;

    statistics.most_reports_failed = most_reports_failed.slice(0, 5);

    statistics.most_user_reports = most_user_reports;

    statistics.most_user_testcases = most_user_testcases;

    statistics.most_version_failed = most_version_failed.slice(0, 5);

    statistics.project_most_testcases = project_most_testcases.slice(0, 5);

    statistics.annual_report = annual_report;

    return res.status(200).json(statistics);
  }
};
