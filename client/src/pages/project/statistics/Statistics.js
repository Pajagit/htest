import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";

import GlobalPanel from "../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../components/project-panel/ProjectPanel";
import { projectIdAndSuperAdminPermission } from "../../../permissions/Permissions";
import { getProjectStatistics } from "../../../actions/statisticActions";

import Dropdown from "../../../components/common/Dropdown";
import Header from "../../../components/common/Header";
import Chart from "../../../components/common/Chart";
import isEmpty from "../../../validation/isEmpty";
import Spinner from "../../../components/common/Spinner";

class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: 0,
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
      mostFailedTCOptions: {
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
      mostFailedTCSeries: [
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
      mostFailedVersionOptions: {
        colors: ["rgb(0, 227, 150)", "#503bbc", "rgb(255, 69, 96)"],
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
      mostFailedVersionSeries: [
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
      // USER MOST TC
      usersWithMostTc: {
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
      usersWithMostReports: {
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
      var { isValid } = projectIdAndSuperAdminPermission(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );
      if (!isValid) {
        nextProps.history.push(`/Projects`);
      }
      if (nextProps.statistics !== prevState.statistics) {
        if (nextProps.statistics.project_statistics && nextProps.statistics.project_statistics.annual_report) {
          var total_months = [];
          var total_testcases = [];
          var total_passed = [];
          var total_failed = [];
          Object.entries(nextProps.statistics.project_statistics.annual_report).forEach(([key, value]) => {
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
        if (nextProps.statistics.project_statistics && nextProps.statistics.project_statistics.most_active_testcases) {
          var newMostActiveTC = prevState;
          var mostActiveTcTitles = [];
          var mostActiveTcPercentage = [];
          Object.entries(nextProps.statistics.project_statistics.most_active_testcases).forEach(([key, value]) => {
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
        if (nextProps.statistics.project_statistics && nextProps.statistics.project_statistics.most_testcases_failed) {
          var most_tc_failed_titles = [];
          var most_tc_failed_testcases = [];
          var most_tc_failed_passed = [];
          var most_tc_failed_failed = [];
          Object.entries(nextProps.statistics.project_statistics.most_testcases_failed).forEach(([key, value]) => {
            most_tc_failed_titles.push(value.title);
            if (value && value.total) {
              most_tc_failed_testcases.push(value.total);
            } else {
              most_tc_failed_testcases.push(0);
            }
            if (value && value.passed) {
              most_tc_failed_passed.push(value.passed);
            } else {
              most_tc_failed_passed.push(0);
            }
            if (value && value.failed) {
              most_tc_failed_failed.push(value.failed);
            } else {
              most_tc_failed_failed.push(0);
            }
          });
          var newMostFailedTc = prevState;
          newMostFailedTc.mostFailedTCOptions.xaxis.categories = most_tc_failed_titles;
          newMostFailedTc.mostFailedTCSeries[0].data = most_tc_failed_passed;
          newMostFailedTc.mostFailedTCSeries[1].data = most_tc_failed_testcases;
          newMostFailedTc.mostFailedTCSeries[2].data = most_tc_failed_failed;
        }
        update.statistics = newMostFailedTc;
        if (nextProps.statistics.project_statistics && nextProps.statistics.project_statistics.most_version_failed) {
          var most_version_failed_titles = [];
          var most_version_failed_total = [];
          var most_version_failed_passed = [];
          var most_version_failed_failed = [];
          Object.entries(nextProps.statistics.project_statistics.most_version_failed).forEach(([key, value]) => {
            most_version_failed_titles.push(value.title);
            if (value && value.total) {
              most_version_failed_total.push(value.total);
            } else {
              most_version_failed_total.push(0);
            }
            if (value && value.passed) {
              most_version_failed_passed.push(value.passed);
            } else {
              most_version_failed_passed.push(0);
            }
            if (value && value.failed) {
              most_version_failed_failed.push(value.failed);
            } else {
              most_version_failed_failed.push(0);
            }
          });
          var newMostFailedVersion = prevState;
          newMostFailedVersion.mostFailedVersionOptions.xaxis.categories = most_version_failed_titles;
          newMostFailedVersion.mostFailedVersionSeries[0].data = most_version_failed_passed;
          newMostFailedVersion.mostFailedVersionSeries[1].data = most_version_failed_total;
          newMostFailedVersion.mostFailedVersionSeries[2].data = most_version_failed_failed;
        }
        update.statistics = newMostFailedVersion;
        if (nextProps.statistics.project_statistics && nextProps.statistics.project_statistics.most_user_testcases) {
          var most_user_testcases_titles = [];
          var most_user_testcases_total = [];
          var most_user_testcases_passed = [];
          var most_user_testcases_failed = [];
          Object.entries(nextProps.statistics.project_statistics.most_user_testcases).forEach(([key, value]) => {
            most_user_testcases_titles.push(value.title);
            if (value && value.total) {
              most_user_testcases_total.push(value.total);
            } else {
              most_user_testcases_total.push(0);
            }
            if (value && value.passed) {
              most_user_testcases_passed.push(value.passed);
            } else {
              most_user_testcases_passed.push(0);
            }
            if (value && value.failed) {
              most_user_testcases_failed.push(value.failed);
            } else {
              most_user_testcases_failed.push(0);
            }
          });
          var newMostUserTestcases = prevState;
          newMostUserTestcases.usersWithMostTc.xaxis.categories = most_user_testcases_titles;
          newMostUserTestcases.usersWithMostTcSeries[0].data = most_user_testcases_total;
        }
        update.statistics = newMostUserTestcases;
        if (nextProps.statistics.project_statistics && nextProps.statistics.project_statistics.most_user_reports) {
          var most_user_report_titles = [];
          var most_user_report_total = [];
          var most_user_report_passed = [];
          var most_user_report_failed = [];
          Object.entries(nextProps.statistics.project_statistics.most_user_reports).forEach(([key, value]) => {
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
          newMostUserReports.usersWithMostReports.xaxis.categories = most_user_report_titles;
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
    var projectId = this.props.match.params.projectId;
    this.setState({ projectId });
    this.props.getProjectStatistics(projectId);
  }

  onChange(e) {
    this.setState({ days: +e.target.value }, () => {
      if (this.state.days === 0) {
        this.props.getProjectStatistics(this.state.projectId);
      } else {
        var days;
        switch (this.state.days) {
          case 1:
            days = 3;
            break;
          case 2:
            days = 7;
            break;
          case 3:
            days = 30;
            break;
          case 4:
            days = 90;
            break;
          case 5:
            days = 180;
            break;
          case 6:
            days = 360;
            break;
          default:
            days = 0;
        }
        this.props.getProjectStatistics(this.state.projectId, days);
      }
    });
  }

  render() {
    var { project_statistics, loading } = this.props.statistics;
    var content = "";
    if (isEmpty(project_statistics) || loading || !this.state.allTCOptions) {
      content = <Spinner />;
    } else {
      if (project_statistics && project_statistics.annual_report) {
        var annualReportComponent = (
          <Chart options={this.state.allTCOptions} series={this.state.allTCSeries} type='area' width='100%' />
        );
      } else {
        annualReportComponent = <div className='no-content'>There is no enough relevant data for annual report</div>;
      }
      if (!isEmpty(project_statistics.most_active_testcases)) {
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

      if (!isEmpty(project_statistics.most_testcases_failed)) {
        var mostTestcasesFailedComponent = (
          <Chart
            options={this.state.mostFailedTCOptions}
            series={this.state.mostFailedTCSeries}
            type='bar'
            width='100%'
          />
        );
      } else {
        mostTestcasesFailedComponent = (
          <div className='no-content'>There is no enough relevant data for most failed test cases</div>
        );
      }

      if (!isEmpty(project_statistics.most_version_failed)) {
        var mostVersionFailedComponent = (
          <div>
            <div className='stats-flex-bottom-right-title'>App versions with most failed reports</div>
            <div className='stats-flex-bottom-right-chart'>
              <Chart
                options={this.state.mostFailedVersionOptions}
                series={this.state.mostFailedVersionSeries}
                type='bar'
                width='100%'
              />
            </div>
          </div>
        );
      } else {
        mostVersionFailedComponent = "";
      }

      if (!isEmpty(project_statistics.most_user_testcases)) {
        var mostUserTestcasesComponent = (
          <Chart
            options={this.state.usersWithMostTc}
            series={this.state.usersWithMostTcSeries}
            type='bar'
            width='100%'
          />
        );
      } else {
        mostUserTestcasesComponent = (
          <div className='no-content'>There is no enough relevant data for users with most test cases</div>
        );
      }

      if (!isEmpty(project_statistics.most_user_reports)) {
        var mostUserReports = (
          <Chart
            options={this.state.usersWithMostReports}
            series={this.state.usersWithMostReportsSeries}
            type='bar'
            width='100%'
          />
        );
      } else {
        mostUserReports = <div className='no-content'>There is no enough relevant data for most failed version</div>;
      }
      if (
        !(project_statistics && project_statistics.annual_report) &&
        isEmpty(project_statistics.most_active_testcases) &&
        isEmpty(project_statistics.most_testcases_failed) &&
        isEmpty(project_statistics.most_version_failed) &&
        isEmpty(project_statistics.most_user_testcases) &&
        isEmpty(project_statistics.most_user_reports)
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
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_testcases &&
                          project_statistics.total_data.total_testcases.value
                            ? project_statistics.total_data.total_testcases.value
                            : "None Created"}
                        </div>
                        <div className='stats-grid--item-1-percentage'>
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_testcases &&
                          project_statistics.total_data.total_testcases.percentage > 0
                            ? "+"
                            : ""}
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_testcases &&
                          project_statistics.total_data.total_testcases.percentage
                            ? `${project_statistics.total_data.total_testcases.percentage} %`
                            : ""}
                        </div>
                      </div>
                    </div>
                    <div className='stats-grid--item'>
                      <div className='stats-grid--item-2'>
                        <div className='stats-grid--item-1-title'>Total Reports</div>
                        <div className='stats-grid--item-1-count'>
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_reports &&
                          project_statistics.total_data.total_reports.value
                            ? project_statistics.total_data.total_reports.value
                            : "None Reported"}
                        </div>
                        <div className='stats-grid--item-1-percentage'>
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_reports &&
                          project_statistics.total_data.total_reports.percentage > 0
                            ? "+"
                            : ""}
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_reports &&
                          project_statistics.total_data.total_reports.percentage
                            ? `${project_statistics.total_data.total_reports.percentage} %`
                            : ""}
                        </div>
                      </div>
                    </div>
                    <div className='stats-grid--item'>
                      <div className='stats-grid--item-3'>
                        <div className='stats-grid--item-1-title'>Passed Reports</div>
                        <div className='stats-grid--item-1-count'>
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_passed_reports &&
                          project_statistics.total_data.total_passed_reports.value
                            ? project_statistics.total_data.total_passed_reports.value
                            : "None Reported"}
                        </div>
                        <div className='stats-grid--item-1-percentage'>
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_passed_reports &&
                          project_statistics.total_data.total_passed_reports.percentage > 0
                            ? "+"
                            : ""}
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_passed_reports &&
                          project_statistics.total_data.total_passed_reports.percentage
                            ? `${project_statistics.total_data.total_passed_reports.percentage} %`
                            : ""}
                        </div>
                      </div>
                    </div>
                    <div className='stats-grid--item'>
                      <div className='stats-grid--item-4'>
                        <div className='stats-grid--item-1-title'>Failed Reports</div>
                        <div className='stats-grid--item-1-count'>
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_failed_reports &&
                          project_statistics.total_data.total_failed_reports.value
                            ? project_statistics.total_data.total_failed_reports.value
                            : "None Reported"}
                        </div>
                        <div className='stats-grid--item-1-percentage'>
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_failed_reports &&
                          project_statistics.total_data.total_failed_reports.percentage > 0
                            ? "+"
                            : ""}
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_failed_reports &&
                          project_statistics.total_data.total_failed_reports.percentage
                            ? `${project_statistics.total_data.total_failed_reports.percentage} %`
                            : ""}
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
                <div className='stats-flex-top-left-title'>
                  Total Data
                  <div className='stats-flex--dropdown'>
                    <Dropdown
                      options={[
                        { id: 0, title: "Time Range" },
                        { id: 1, title: "3 Days" },
                        { id: 2, title: "Week" },
                        { id: 3, title: "Month" },
                        { id: 4, title: "3 Months" },
                        { id: 5, title: "6 Month" },
                        { id: 6, title: "Year" }
                      ]}
                      value={this.state.days}
                      onChange={e => this.onChange(e)}
                    />
                  </div>
                </div>
                <div className='stats-flex-top-left-chart'>
                  <div className='stats-grid'>
                    <div className='stats-grid--item'>
                      <div className='stats-grid--item-1'>
                        <div className='stats-grid--item-1-title'>Total Test Cases</div>
                        <div className='stats-grid--item-1-count'>
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_testcases &&
                          project_statistics.total_data.total_testcases.value
                            ? project_statistics.total_data.total_testcases.value
                            : "None Created"}
                        </div>
                        <div className='stats-grid--item-1-percentage'>
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_testcases &&
                          project_statistics.total_data.total_testcases.percentage > 0
                            ? "+"
                            : ""}
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_testcases &&
                          project_statistics.total_data.total_testcases.percentage
                            ? `${project_statistics.total_data.total_testcases.percentage} %`
                            : ""}
                        </div>
                      </div>
                    </div>
                    <div className='stats-grid--item'>
                      <div className='stats-grid--item-2'>
                        <div className='stats-grid--item-1-title'>Total Reports</div>
                        <div className='stats-grid--item-1-count'>
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_reports &&
                          project_statistics.total_data.total_reports.value
                            ? project_statistics.total_data.total_reports.value
                            : "None Reported"}
                        </div>
                        <div className='stats-grid--item-1-percentage'>
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_reports &&
                          project_statistics.total_data.total_reports.percentage > 0
                            ? "+"
                            : ""}
                          {/* {project_statistics.total_data &&
                          project_statistics.total_data.total_reports &&
                          project_statistics.total_data.total_reports.percentage
                            ? `${project_statistics.total_data.total_reports.percentage} %`
                            : ""} */}
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_reports.value &&
                          project_statistics.total_data &&
                          project_statistics.total_data.total_testcases.value
                            ? Math.round(
                                (project_statistics.total_data.total_reports.value /
                                  project_statistics.total_data.total_testcases.value) *
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
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_passed_reports &&
                          project_statistics.total_data.total_passed_reports.value
                            ? project_statistics.total_data.total_passed_reports.value
                            : "None Reported"}
                        </div>
                        <div className='stats-grid--item-1-percentage'>
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_passed_reports &&
                          project_statistics.total_data.total_passed_reports.percentage > 0
                            ? "+"
                            : ""}
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_reports &&
                          project_statistics.total_data.total_reports.value &&
                          project_statistics.total_data &&
                          project_statistics.total_data.total_passed_reports
                            ? `${Math.round(
                                ((project_statistics.total_data.total_passed_reports.value /
                                  project_statistics.total_data.total_reports.value) *
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
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_failed_reports &&
                          project_statistics.total_data.total_failed_reports.value
                            ? project_statistics.total_data.total_failed_reports.value
                            : "None Reported"}
                        </div>
                        <div className='stats-grid--item-1-percentage'>
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_failed_reports &&
                          project_statistics.total_data.total_failed_reports.percentage > 0
                            ? "+"
                            : ""}
                          {project_statistics.total_data &&
                          project_statistics.total_data.total_reports &&
                          project_statistics.total_data.total_reports.value &&
                          project_statistics.total_data &&
                          project_statistics.total_data.total_failed_reports
                            ? `${Math.round(
                                ((project_statistics.total_data.total_failed_reports.value /
                                  project_statistics.total_data.total_reports.value) *
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
                <div className='stats-flex-top-right-title'>Most Active Test Cases</div>
                <div className='stats-flex-top-right-chart'>{mostTestcasesComponent}</div>
              </div>
            </div>
            <div className='stats-flex-bottom'>
              <div className='stats-flex-bottom-left'>
                <div className='stats-flex-bottom-left-title'>Test Cases with most falied reports</div>
                <div className='stats-flex-bottom-left-chart'>{mostTestcasesFailedComponent}</div>
              </div>
              <div className='stats-flex-bottom-right'>
                <div className='stats-flex-bottom-right-title'>Users with most created reports</div>
                <div className='stats-flex-bottom-right-chart'>{mostUserReports}</div>
              </div>
            </div>

            <div className='stats-flex-bottom'>
              <div className='stats-flex-bottom-left'>
                <div className='stats-flex-bottom-left-title'>Users with most created test cases</div>
                <div className='stats-flex-bottom-left-chart'>{mostUserTestcasesComponent}</div>
              </div>
              <div className='stats-flex-bottom-right'>{mostVersionFailedComponent}</div>
            </div>
          </div>
        );
      }
    }

    return (
      <div className='wrapper'>
        <GlobalPanel props={this.props} />
        <ProjectPanel props={this.props} />
        <div className='main-content main-content-grid'>
          <Header
            icon={<i className='far fa-chart-bar'></i>}
            title={
              this.props.project && this.props.project.title
                ? this.props.project.title + " Statistics"
                : "Project Statistics"
            }
            history={this.props}
            canGoBack={false}
          />
          {content}
        </div>
      </div>
    );
  }
}

Statistics.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  project: state.projects.project,
  statistics: state.statistics
});

export default connect(mapStateToProps, { getProjectStatistics })(withRouter(Statistics));
