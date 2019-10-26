import React, { Component } from "react";

import GlobalPanel from "../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../components/project-panel/ProjectPanel";
import Header from "../../../components/common/Header";
import Chart from "../../../components/common/Chart";

export default class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // ALL TCs
      allTCOptions: {
        colors: ["#a592ff", "rgb(0, 227, 150)", "rgb(255, 69, 96)"],

        chart: {
          id: "bar",
          height: 900,

          zoom: {
            enabled: false
          }
        },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dev"]
        }
      },
      allTCSeries: [
        {
          name: "Test Cases",
          data: [22, 42, 24, 35, 24, 43, 37, 25, 23, 14, 41, 27]
        },
        {
          name: "Passed",
          data: [20, 36, 18, 31, 23, 40, 31, 15, 16, 11, 35, 22]
        },

        {
          name: "Failed",
          data: [2, 6, 6, 4, 1, 3, 6, 10, 7, 3, 6, 5]
        }
      ],
      // MOST ACTIVE
      mostActiveOptions: {
        legend: {
          position: "bottom"
        },
        dropShadow: true,
        chart: {
          id: "bar",
          height: "400px",
          zoom: {
            enabled: false
          }
        },
        labels: ["Login", "Change Password", "Single Voyage Report", "Missing Reports"]
      },

      mostActiveSeries: [55, 44, 33, 13],

      // MOST FAILED TC
      mostFailedTCOptions: {
        colors: ["#a592ff", "rgb(0, 227, 150)", "rgb(255, 69, 96)"],
        chart: {
          id: "bar",
          height: "600px",
          zoom: {
            enabled: false
          }
        },
        xaxis: {
          categories: ["Login", "Change Password", "Single Voyage Report", "Missing Reports", "KPI"]
        }
      },
      mostFailedTCSeries: [
        {
          name: "Test Cases",
          data: [42, 24, 35, 22, 24]
        },
        {
          name: "Passed",
          data: [36, 18, 31, 20, 23]
        },

        {
          name: "Failed",
          data: [6, 6, 4, 2, 1]
        }
      ],
      // MOST FAILED VERSION
      mostFailedVersionOptions: {
        colors: ["#a592ff", "rgb(0, 227, 150)", "rgb(255, 69, 96)"],
        chart: {
          id: "bar",
          zoom: {
            enabled: false
          }
        },
        xaxis: {
          categories: ["2.1", "3.4", "1.2", "4.1", "2.6"]
        }
      },
      mostFailedVersionSeries: [
        {
          name: "Test Cases",
          data: [92, 75, 95, 136, 31]
        },
        {
          name: "Passed",
          data: [68, 52, 77, 120, 23]
        },

        {
          name: "Failed",
          data: [24, 23, 18, 16, 8]
        }
      ]
    };
  }

  render() {
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel props={this.props} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="far fa-chart-bar"></i>}
            title={"Statistics"}
            history={this.props}
            canGoBack={false}
          />
          <div className="stats-flex">
            <div className="stats-flex-top">
              <div className="stats-flex-top-left">
                <div className="stats-flex-top-left-title">Test Cases</div>

                <div className="stats-flex-top-left-chart">
                  <div className="stats-grid">
                    <div className="stats-grid--item">
                      <div className="stats-grid--item-1">
                        <div className="stats-grid--item-1-title">Total Test Cases</div>
                        <div className="stats-grid--item-1-count">7263</div>
                        <div className="stats-grid--item-1-percentage">+ 14.4%</div>
                      </div>
                    </div>
                    <div className="stats-grid--item">
                      <div className="stats-grid--item-2">
                        <div className="stats-grid--item-1-title">Total Reports</div>
                        <div className="stats-grid--item-1-count">3622</div>
                        <div className="stats-grid--item-1-percentage">- 22.1%</div>
                      </div>
                    </div>
                    <div className="stats-grid--item">
                      <div className="stats-grid--item-3">
                        <div className="stats-grid--item-1-title">Passed Reports</div>
                        <div className="stats-grid--item-1-count">1980</div>
                        <div className="stats-grid--item-1-percentage">+ 17.1%</div>
                      </div>
                    </div>
                    <div className="stats-grid--item">
                      <div className="stats-grid--item-4">
                        <div className="stats-grid--item-1-title">Failed Reports</div>
                        <div className="stats-grid--item-1-count">2029</div>
                        <div className="stats-grid--item-1-percentage">- 16.3%</div>
                      </div>
                    </div>
                  </div>
                  <Chart options={this.state.allTCOptions} series={this.state.allTCSeries} type="area" width="100%" />
                </div>
              </div>
              <div className="stats-flex-top-right">
                <div className="stats-flex-top-right-title">Most Active Test Cases</div>
                <div className="stats-flex-top-right-chart">
                  <Chart
                    options={this.state.mostActiveOptions}
                    series={this.state.mostActiveSeries}
                    type="donut"
                    width="100%"
                    legend={this.state.legend1}
                  />
                </div>
              </div>
            </div>
            <div className="stats-flex-bottom">
              <div className="stats-flex-bottom-left">
                <div className="stats-flex-bottom-left-title">Test Cases with most falied reports</div>
                <div className="stats-flex-bottom-left-chart">
                  <Chart
                    options={this.state.mostFailedTCOptions}
                    series={this.state.mostFailedTCSeries}
                    type="bar"
                    width="100%"
                  />
                </div>
              </div>
              <div className="stats-flex-bottom-right">
                <div className="stats-flex-bottom-right-title">App versions with most failed reports</div>
                <div className="stats-flex-bottom-right-chart">
                  <Chart
                    options={this.state.mostFailedVersionOptions}
                    series={this.state.mostFailedVersionSeries}
                    type="bar"
                    width="100%"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
