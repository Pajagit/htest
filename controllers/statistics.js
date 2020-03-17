const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const BrowserService = require("../services/browser");
const UserService = require("../services/user");
const StatisticsService = require("../services/statistics");

module.exports = {
  getStatistics: async function(req, res) {
    var totalTestcases = await StatisticsService.getTotalTestcases(req.params.id);
    var totalReports = await StatisticsService.getTotalReports(req.params.id);
    var totalsReportsPassed = await StatisticsService.getTotalReportsPassed(req.params.id);
    var totalsReportsFailed = await StatisticsService.getTotalReportsFailed(req.params.id);
    var most_active_testcases = await StatisticsService.getMostActiveTestcases(req.params.id, 5);
    var most_testcases_failed = await StatisticsService.getMostTestcasesFailed(req.params.id, 5);

    if (most_testcases_failed) {
      for (var i = 0; i < most_testcases_failed.length; i++) {
        most_testcases_failed[i].passed = await StatisticsService.getCountReportsPassed(
          most_testcases_failed[i].test_case_id
        );
        most_testcases_failed[i].total = most_testcases_failed[i].failed + most_testcases_failed[i].passed;
        delete most_testcases_failed[i]["test_case_id"];
      }
    }

    var most_user_reports = await StatisticsService.getMostReportsUsers(req.params.id, 5);
    if (most_user_reports) {
      for (var j = 0; j < most_user_reports.length; j++) {
        most_user_reports[j].passed = await StatisticsService.getCountReportsPassedForUser(
          most_user_reports[j].user_id,
          req.params.id
        );
        most_user_reports[j].failed = await StatisticsService.getCountReportsFailedForUser(
          most_user_reports[j].user_id,
          req.params.id
        );
        delete most_user_reports[j]["user_id"];
      }
    }

    var most_user_testcases = await StatisticsService.getMostTestcasesUsers(req.params.id, 5);

    // var most_version_failed = await StatisticsService.getMostVersionsFailed(req.params.id, 5);

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

    // statistics.most_version_failed = statistics;

    return res.status(200).json(statistics);
  }
};
