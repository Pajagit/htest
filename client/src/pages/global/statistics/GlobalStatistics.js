import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";

import GlobalPanel from "../../../components/global-panel/GlobalPanel";
import { superAdminPermissions } from "../../../permissions/Permissions";
import { getGlobalStatistics } from "../../../actions/statisticActions";

import Header from "../../../components/common/Header";
import Chart from "../../../components/common/Chart";
import isEmpty from "../../../validation/isEmpty";
import Spinner from "../../../components/common/Spinner";

class GlobalStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statistics: this.props.statistics.project_statistics,
      // ALL TCs
      allTCOptions: {
        colors: ["#503bbc", "rgb(0, 227, 150)", "rgb(255, 69, 96)"],
        legend: {
          show: false
        },
        chart: {
          id: "bar",
          height: 900,

          zoom: {
            enabled: false
          }
        },
        xaxis: {
          tickPlacement: "between",
          categories: []
        }
      },
      allTCSeries: [
        {
          name: "Reports",
          data: []
        },
        {
          name: "Passed",
          data: []
        },
        {
          name: "Failed",
          data: []
        }
      ],
      // MOST ACTIVE
      mostActiveOptions: {
        plotOptions: {
          pie: {
            donut: {
              size: "50%"
            }
          }
        },
        legend: {
          position: "bottom"
        },

        labels: []
      },

      mostActiveSeries: [],

      // MOST FAILED TC
      mostProjectReportsFailedOptions: {
        colors: ["rgb(0, 227, 150)", "#503bbc", "rgb(255, 69, 96)"],
        legend: {
          show: false
        },
        chart: {
          id: "bar",
          height: "600px",
          zoom: {
            enabled: false
          }
        },
        xaxis: {
          categories: []
        }
      },
      mostProjectReportsFailedSeries: [
        {
          name: "Passed",
          data: []
        },
        {
          name: "Reports",
          data: []
        },
        {
          name: "Failed",
          data: []
        }
      ],
      // MOST FAILED VERSION
      mostProjectTestcasesOptions: {
        colors: ["#a592ff"],
        legend: {
          show: false
        },
        chart: {
          id: "bar",
          zoom: {
            enabled: false
          }
        },
        xaxis: {
          categories: []
        }
      },
      mostProjectTestcasesSeries: [
        {
          name: "Test Cases",
          data: []
        }
      ],
      // USER MOST TC
      usersWithMostTcOptions: {
        colors: ["#a592ff"],
        legend: {
          show: false
        },
        chart: {
          id: "bar",
          height: "600px",
          zoom: {
            enabled: false
          }
        },
        xaxis: {
          categories: []
        }
      },
      usersWithMostTcSeries: [
        {
          name: "Test Cases",
          data: []
        }
      ],
      // USER MOST Reports
      usersWithMostReportsOptions: {
        colors: ["rgb(0, 227, 150)", "#503bbc", "rgb(255, 69, 96)"],
        legend: {
          show: false
        },
        chart: {
          id: "bar",
          height: "600px",
          zoom: {
            enabled: false
          }
        },
        xaxis: {
          categories: []
        }
      },
      usersWithMostReportsSeries: [
        {
          name: "Passed",
          data: []
        },
        {
          name: "Reports",
          data: []
        },
        {
          name: "Failed",
          data: []
        }
      ]
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    if (nextProps.auth && nextProps.auth.user) {
      var { isValid } = superAdminPermissions(nextProps.auth.user.superadmin);
      if (!isValid) {
        nextProps.history.push(`/Projects`);
      }
      if (nextProps.statistics !== prevState.statistics) {
        if (nextProps.statistics.global_statistics && nextProps.statistics.global_statistics.annual_report) {
          var total_months = [];
          var total_testcases = [];
          var total_passed = [];
          var total_failed = [];
          Object.entries(nextProps.statistics.global_statistics.annual_report).forEach(([key, value]) => {
            if (value && value.month) {
              total_months.push(value.month);
            }
            if (value && value.total) {
              total_testcases.push(value.total);
            } else {
              total_testcases.push(0);
            }
            if (value && value.passed) {
              total_passed.push(value.passed);
            } else {
              total_passed.push(0);
            }
            if (value && value.failed) {
              total_failed.push(value.failed);
            } else {
              total_failed.push(0);
            }
          });
          var newAnnual = prevState;
          newAnnual.allTCOptions.xaxis.categories = total_months;
          newAnnual.allTCSeries[0].data = total_testcases;
          newAnnual.allTCSeries[1].data = total_passed;
          newAnnual.allTCSeries[2].data = total_failed;
        }
        update.statistics = newAnnual;
        if (nextProps.statistics.global_statistics && nextProps.statistics.global_statistics.most_active_projects) {
          var newMostActiveTC = prevState;
          var mostActiveTcTitles = [];
          var mostActiveTcPercentage = [];
          Object.entries(nextProps.statistics.global_statistics.most_active_projects).forEach(([key, value]) => {
            if (value.title) {
              if (value.percentage !== null && !isNaN(value.percentage) && value.title !== null) {
                mostActiveTcTitles.push(value.title);
                mostActiveTcPercentage.push(value.percentage);
              }
            }
          });
          newMostActiveTC.mostActiveOptions.labels = mostActiveTcTitles;
          newMostActiveTC.mostActiveSeries = mostActiveTcPercentage;
        }
        update.statistics = newMostActiveTC;
        if (nextProps.statistics.global_statistics && nextProps.statistics.global_statistics.most_reports_failed) {
          var most_reports_failed_titles = [];
          var most_reports_failed_testcases = [];
          var most_reports_failed_passed = [];
          var most_reports_failed_failed = [];
          Object.entries(nextProps.statistics.global_statistics.most_reports_failed).forEach(([key, value]) => {
            most_reports_failed_titles.push(value.title);
            if (value && value.total) {
              most_reports_failed_testcases.push(value.total);
            } else {
              most_reports_failed_testcases.push(0);
            }
            if (value && value.passed) {
              most_reports_failed_passed.push(value.passed);
            } else {
              most_reports_failed_passed.push(0);
            }
            if (value && value.failed) {
              most_reports_failed_failed.push(value.failed);
            } else {
              most_reports_failed_failed.push(0);
            }
          });
          var newMostFailedTc = prevState;
          newMostFailedTc.mostProjectReportsFailedOptions.xaxis.categories = most_reports_failed_titles;
          newMostFailedTc.mostProjectReportsFailedSeries[0].data = most_reports_failed_passed;
          newMostFailedTc.mostProjectReportsFailedSeries[1].data = most_reports_failed_testcases;

          newMostFailedTc.mostProjectReportsFailedSeries[2].data = most_reports_failed_failed;
        }
        update.statistics = newMostFailedTc;
        if (nextProps.statistics.global_statistics && nextProps.statistics.global_statistics.project_most_testcases) {
          var project_most_testcases_titles = [];
          var project_most_testcases_total = [];
          Object.entries(nextProps.statistics.global_statistics.project_most_testcases).forEach(([key, value]) => {
            project_most_testcases_titles.push(value.title);
            if (value && value.count) {
              project_most_testcases_total.push(value.count);
            }
          });
          var newMostProjectTestcases = prevState;
          newMostProjectTestcases.mostProjectTestcasesOptions.xaxis.categories = project_most_testcases_titles;
          newMostProjectTestcases.mostProjectTestcasesSeries[0].data = project_most_testcases_total;
        }
        update.statistics = newMostProjectTestcases;
        if (nextProps.statistics.global_statistics && nextProps.statistics.global_statistics.most_user_testcases) {
          var most_user_testcases_titles = [];
          var most_user_testcases_total = [];

          Object.entries(nextProps.statistics.global_statistics.most_user_testcases).forEach(([key, value]) => {
            most_user_testcases_titles.push(value.title);
            if (value && value.total) {
              most_user_testcases_total.push(value.total);
            }
          });
          var newMostUserTestcases = prevState;
          newMostUserTestcases.usersWithMostTcOptions.xaxis.categories = most_user_testcases_titles;
          newMostUserTestcases.usersWithMostTcSeries[0].data = most_user_testcases_total;
        }
        update.statistics = newMostUserTestcases;
        if (nextProps.statistics.global_statistics && nextProps.statistics.global_statistics.most_user_reports) {
          var most_user_report_titles = [];
          var most_user_report_total = [];
          var most_user_report_passed = [];
          var most_user_report_failed = [];
          Object.entries(nextProps.statistics.global_statistics.most_user_reports).forEach(([key, value]) => {
            most_user_report_titles.push(value.title);
            if (value && value.total) {
              most_user_report_total.push(value.total);
            } else {
              most_user_report_total.push(0);
            }
            if (value && value.passed) {
              most_user_report_passed.push(value.passed);
            } else {
              most_user_report_passed.push(0);
            }
            if (value && value.failed) {
              most_user_report_failed.push(value.failed);
            } else {
              most_user_report_failed.push(0);
            }
          });
          var newMostUserReports = prevState;
          newMostUserReports.usersWithMostReportsOptions.xaxis.categories = most_user_report_titles;
          newMostUserReports.usersWithMostReportsSeries[0].data = most_user_report_passed;
          newMostUserReports.usersWithMostReportsSeries[1].data = most_user_report_total;
          newMostUserReports.usersWithMostReportsSeries[2].data = most_user_report_failed;
        }
        update.statistics = newMostUserReports;
      }
    }
    return Object.keys(update).length ? update : null;
  }
  componentDidMount() {
    // var projectId = this.props.match.params.projectId;
    // this.setState({ projectId });
    this.props.getGlobalStatistics();
  }

  render() {
    var { global_statistics, loading } = this.props.statistics;
    var content = "";
    if (isEmpty(global_statistics) || loading || !this.state.allTCOptions) {
      content = <Spinner />;
    } else {
      if (global_statistics && global_statistics.annual_report) {
        var annualReportComponent = (
          <Chart options={this.state.allTCOptions} series={this.state.allTCSeries} type='area' width='100%' />
        );
      } else {
        annualReportComponent = <div className='no-content'>There is no enough relevant data for annual report</div>;
      }
      if (!isEmpty(global_statistics.most_active_projects)) {
        var mostTestcasesComponent = (
          <Chart
            options={this.state.mostActiveOptions}
            series={this.state.mostActiveSeries}
            type='donut'
            width='100%'
            legend={this.state.legend1}
          />
        );
      } else {
        mostTestcasesComponent = (
          <div className='no-content'>There is no enough relevant data for most active test cases</div>
        );
      }

      if (!isEmpty(global_statistics.most_reports_failed)) {
        var mostTestcasesFailedComponent = (
          <Chart
            options={this.state.mostProjectReportsFailedOptions}
            series={this.state.mostProjectReportsFailedSeries}
            type='bar'
            width='100%'
          />
        );
      } else {
        mostTestcasesFailedComponent = (
          <div className='no-content'>There is no enough relevant data for most failed test cases</div>
        );
      }

      if (!isEmpty(global_statistics.project_most_testcases)) {
        var mostVersionFailedComponent = (
          <Chart
            options={this.state.mostProjectTestcasesOptions}
            series={this.state.mostProjectTestcasesSeries}
            type='bar'
            width='100%'
          />
        );
      } else {
        mostVersionFailedComponent = (
          <div className='no-content'>There is no enough relevant data for most failed version</div>
        );
      }

      if (!isEmpty(global_statistics.most_user_testcases)) {
        var mostUserTestcasesComponent = (
          <Chart
            options={this.state.usersWithMostTcOptions}
            series={this.state.usersWithMostTcSeries}
            type='bar'
            width='100%'
          />
        );
      } else {
        mostUserTestcasesComponent = (
          <div className='no-content'>There is no enough relevant data for most failed version</div>
        );
      }

      if (!isEmpty(global_statistics.most_user_reports)) {
        var mostUserReports = (
          <Chart
            options={this.state.usersWithMostReportsOptions}
            series={this.state.usersWithMostReportsSeries}
            type='bar'
            width='100%'
          />
        );
      } else {
        mostUserReports = <div className='no-content'>There is no enough relevant data for most failed version</div>;
      }
      if (
        !(global_statistics && global_statistics.annual_report) &&
        isEmpty(global_statistics.most_active_projects) &&
        isEmpty(global_statistics.most_testcases_failed) &&
        isEmpty(global_statistics.project_most_testcases) &&
        isEmpty(global_statistics.most_user_testcases) &&
        isEmpty(global_statistics.most_user_reports)
      ) {
        content = (
          <div className='stats-flex'>
            <div className='stats-flex-top'>
              <div className='stats-flex-top-left'>
                <div className='stats-flex-top-left-title'>Total Data</div>

                <div className='stats-flex-top-left-chart'>
                  <div className='stats-grid'>
                    <div className='stats-grid--item'>
                      <div className='stats-grid--item-1'>
                        <div className='stats-grid--item-1-title'>Total Test Cases</div>
                        <div className='stats-grid--item-1-count'>
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_testcases &&
                          global_statistics.total_data.total_testcases.value
                            ? global_statistics.total_data.total_testcases.value
                            : "None Created"}
                        </div>
                        <div className='stats-grid--item-1-percentage'>
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_testcases &&
                          global_statistics.total_data.total_testcases.percentage > 0
                            ? "+"
                            : ""}
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_testcases &&
                          global_statistics.total_data.total_testcases.percentage
                            ? `${global_statistics.total_data.total_testcases.percentage} %`
                            : "No Changes"}
                        </div>
                      </div>
                    </div>
                    <div className='stats-grid--item'>
                      <div className='stats-grid--item-2'>
                        <div className='stats-grid--item-1-title'>Total Reports</div>
                        <div className='stats-grid--item-1-count'>
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_reports &&
                          global_statistics.total_data.total_reports.value
                            ? global_statistics.total_data.total_reports.value
                            : "None Reported"}
                        </div>
                        <div className='stats-grid--item-1-percentage'>
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_reports &&
                          global_statistics.total_data.total_reports.percentage > 0
                            ? "+"
                            : ""}
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_reports &&
                          global_statistics.total_data.total_reports.percentage
                            ? `${global_statistics.total_data.total_reports.percentage} %`
                            : "No Changes"}
                        </div>
                      </div>
                    </div>
                    <div className='stats-grid--item'>
                      <div className='stats-grid--item-3'>
                        <div className='stats-grid--item-1-title'>Passed Reports</div>
                        <div className='stats-grid--item-1-count'>
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_passed_reports &&
                          global_statistics.total_data.total_passed_reports.value
                            ? global_statistics.total_data.total_passed_reports.value
                            : "None Reported"}
                        </div>
                        <div className='stats-grid--item-1-percentage'>
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_passed_reports &&
                          global_statistics.total_data.total_passed_reports.percentage > 0
                            ? "+"
                            : ""}
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_passed_reports &&
                          global_statistics.total_data.total_passed_reports.percentage
                            ? `${global_statistics.total_data.total_passed_reports.percentage} %`
                            : "No Changes"}
                        </div>
                      </div>
                    </div>
                    <div className='stats-grid--item'>
                      <div className='stats-grid--item-4'>
                        <div className='stats-grid--item-1-title'>Failed Reports</div>
                        <div className='stats-grid--item-1-count'>
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_failed_reports &&
                          global_statistics.total_data.total_failed_reports.value
                            ? global_statistics.total_data.total_failed_reports.value
                            : "None Reported"}
                        </div>
                        <div className='stats-grid--item-1-percentage'>
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_failed_reports &&
                          global_statistics.total_data.total_failed_reports.percentage > 0
                            ? "+"
                            : ""}
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_failed_reports &&
                          global_statistics.total_data.total_failed_reports.percentage
                            ? `${global_statistics.total_data.total_failed_reports.percentage} %`
                            : "No Changes"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {annualReportComponent}
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        content = (
          <div className='stats-flex'>
            <div className='stats-flex-top'>
              <div className='stats-flex-top-left'>
                <div className='stats-flex-top-left-title'>Total Data</div>

                <div className='stats-flex-top-left-chart'>
                  <div className='stats-grid'>
                    <div className='stats-grid--item'>
                      <div className='stats-grid--item-1'>
                        <div className='stats-grid--item-1-title'>Total Test Cases</div>
                        <div className='stats-grid--item-1-count'>
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_testcases &&
                          global_statistics.total_data.total_testcases.value
                            ? global_statistics.total_data.total_testcases.value
                            : "None Created"}
                        </div>
                        <div className='stats-grid--item-1-percentage'>
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_testcases &&
                          global_statistics.total_data.total_testcases.percentage > 0
                            ? "+"
                            : ""}
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_testcases &&
                          global_statistics.total_data.total_testcases.percentage
                            ? `${global_statistics.total_data.total_testcases.percentage} %`
                            : ""}
                        </div>
                      </div>
                    </div>
                    <div className='stats-grid--item'>
                      <div className='stats-grid--item-2'>
                        <div className='stats-grid--item-1-title'>Total Reports</div>
                        <div className='stats-grid--item-1-count'>
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_reports &&
                          global_statistics.total_data.total_reports.value
                            ? global_statistics.total_data.total_reports.value
                            : "None Reported"}
                        </div>
                        <div className='stats-grid--item-1-percentage'>
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_reports &&
                          global_statistics.total_data.total_reports.percentage > 0
                            ? "+"
                            : ""}
                          {/* {global_statistics.total_data &&
                          global_statistics.total_data.total_reports &&
                          global_statistics.total_data.total_reports.percentage
                            ? `${global_statistics.total_data.total_reports.percentage} %`
                            : "No Changes"} */}
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_reports.value &&
                          global_statistics.total_data &&
                          global_statistics.total_data.total_testcases.value
                            ? Math.round(
                                (global_statistics.total_data.total_reports.value /
                                  global_statistics.total_data.total_testcases.value) *
                                  100 +
                                  Number.EPSILON
                              ) / 100
                            : ""}
                          <i className='fas fa-info-circle ml-0 primary-text' data-tip data-for='ratio'></i>
                          <ReactTooltip
                            id='ratio'
                            aria-haspopup='true'
                            className='custom-color-no-arrow'
                            textColor='#fff'
                            backgroundColor='#4d3cb5'
                            effect='solid'
                          >
                            <p>Reports / Test Cases ratio</p>
                          </ReactTooltip>
                        </div>
                      </div>
                    </div>
                    <div className='stats-grid--item'>
                      <div className='stats-grid--item-3'>
                        <div className='stats-grid--item-1-title'>Passed Reports</div>
                        <div className='stats-grid--item-1-count'>
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_passed_reports &&
                          global_statistics.total_data.total_passed_reports.value
                            ? global_statistics.total_data.total_passed_reports.value
                            : "None Reported"}
                        </div>
                        <div className='stats-grid--item-1-percentage'>
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_passed_reports &&
                          global_statistics.total_data.total_passed_reports.percentage > 0
                            ? "+"
                            : ""}
                          {/* {global_statistics.total_data &&
                          global_statistics.total_data.total_passed_reports &&
                          global_statistics.total_data.total_passed_reports.percentage
                            ? `${global_statistics.total_data.total_passed_reports.percentage} %`
                            : "No Changes"} */}
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_reports &&
                          global_statistics.total_data.total_reports.value &&
                          global_statistics.total_data &&
                          global_statistics.total_data.total_passed_reports
                            ? `${Math.round(
                                ((global_statistics.total_data.total_passed_reports.value /
                                  global_statistics.total_data.total_reports.value) *
                                  100 +
                                  Number.EPSILON) *
                                  100
                              ) / 100} %`
                            : ""}
                          <i className='fas fa-info-circle ml-0 passed-text' data-tip data-for='passed'></i>
                          <ReactTooltip
                            id='passed'
                            aria-haspopup='true'
                            className='custom-color-no-arrow'
                            textColor='#000'
                            backgroundColor='#00e396'
                            effect='solid'
                          >
                            <p>Percentage of passed reports</p>
                          </ReactTooltip>
                        </div>
                      </div>
                    </div>
                    <div className='stats-grid--item'>
                      <div className='stats-grid--item-4'>
                        <div className='stats-grid--item-1-title'>Failed Reports</div>
                        <div className='stats-grid--item-1-count'>
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_failed_reports &&
                          global_statistics.total_data.total_failed_reports.value
                            ? global_statistics.total_data.total_failed_reports.value
                            : "None Reported"}
                        </div>
                        <div className='stats-grid--item-1-percentage'>
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_failed_reports &&
                          global_statistics.total_data.total_failed_reports.percentage > 0
                            ? "+"
                            : ""}
                          {/* {global_statistics.total_data &&
                          global_statistics.total_data.total_failed_reports &&
                          global_statistics.total_data.total_failed_reports.percentage
                            ? `${global_statistics.total_data.total_failed_reports.percentage} %`
                            : "No Changes"} */}
                          {global_statistics.total_data &&
                          global_statistics.total_data.total_reports &&
                          global_statistics.total_data.total_reports.value &&
                          global_statistics.total_data &&
                          global_statistics.total_data.total_failed_reports
                            ? `${Math.round(
                                ((global_statistics.total_data.total_failed_reports.value /
                                  global_statistics.total_data.total_reports.value) *
                                  100 +
                                  Number.EPSILON) *
                                  100
                              ) / 100} %`
                            : ""}
                          <i className='fas fa-info-circle ml-0 failed-text' data-tip data-for='failed'></i>
                          <ReactTooltip
                            id='failed'
                            aria-haspopup='true'
                            className='custom-color-no-arrow'
                            textColor='#fff'
                            backgroundColor='#ff4560'
                            effect='solid'
                          >
                            <p>Percentage of failed reports</p>
                          </ReactTooltip>
                        </div>
                      </div>
                    </div>
                  </div>

                  {annualReportComponent}
                </div>
              </div>
              <div className='stats-flex-top-right'>
                <div className='stats-flex-top-right-title'>Most Active Projects</div>
                <div className='stats-flex-top-right-chart'>{mostTestcasesComponent}</div>
              </div>
            </div>
            <div className='stats-flex-bottom'>
              <div className='stats-flex-bottom-left'>
                <div className='stats-flex-bottom-left-title'>Project with most falied reports</div>
                <div className='stats-flex-bottom-left-chart'>{mostTestcasesFailedComponent}</div>
              </div>
              <div className='stats-flex-bottom-right'>
                <div className='stats-flex-bottom-right-title'>Projects with most test cases</div>
                <div className='stats-flex-bottom-right-chart'>{mostVersionFailedComponent}</div>
              </div>
            </div>

            <div className='stats-flex-bottom'>
              <div className='stats-flex-bottom-left'>
                <div className='stats-flex-bottom-left-title'>Users with most created test cases</div>
                <div className='stats-flex-bottom-left-chart'>{mostUserTestcasesComponent}</div>
              </div>
              <div className='stats-flex-bottom-right'>
                <div className='stats-flex-bottom-right-title'>Users with most created reports</div>
                <div className='stats-flex-bottom-right-chart'>{mostUserReports}</div>
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <div className='wrapper'>
        <GlobalPanel props={this.props} />
        <div className='main-content full-content-grid'>
          <Header
            icon={<i className='far fa-chart-bar'></i>}
            title={"Global Statistics"}
            history={this.props}
            canGoBack={false}
          />
          {content}
        </div>
      </div>
    );
  }
}

GlobalStatistics.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  statistics: state.statistics
});

export default connect(mapStateToProps, { getGlobalStatistics })(withRouter(GlobalStatistics));
