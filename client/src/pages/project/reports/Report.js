import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import GlobalPanel from "../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../components/project-panel/ProjectPanel";
import isEmpty from "../../../validation/isEmpty";
import Header from "../../../components/common/Header";
import Tag from "../../../components/common/Tag";
import { superAndProjectAdminPermissions } from "../../../permissions/Permissions";
import Spinner from "../../../components/common/Spinner";
import moment from "moment";

import { getReport } from "../../../actions/reportActions";

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: false,
      value: null,
      //   user: this.props.auth.user,
      selectedUsers: [],
      users: [],
      width: 0,
      height: 0
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    if (nextProps.auth && nextProps.auth.user) {
      var { isValid } = superAndProjectAdminPermissions(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );
      if (!isValid) {
        nextProps.history.push(`/Reports`);
      }
    }
    // update.isValidWrite = isValidWrite.isValid;
    return Object.keys(update).length ? update : null;
  }

  componentDidMount() {
    var reportId = this.props.match.params.reportId;
    this.props.getReport(reportId);
  }

  render() {
    var content;
    var { report } = this.props.reports;
    var { loading } = this.props.reports;
    if (isEmpty(report) || loading) {
      content = <Spinner />;
    } else {
      console.log(this.props);
      content = (
        <div>
          <div className="report-details">
            <div className="report-details--header">
              <div className="report-details-container-top">
                <div className="report-details-header">
                  <div className="report-details-header--value">{report.title}</div>
                  <br />
                  <div className="report-details-header--title">
                    {report.testcase_user.first_name} {report.testcase_user.last_name}{" "}
                    {report.testcase_user.position ? ", " + report.testcase_user.position : ""}
                  </div>
                  <div className="report-details-header--subvalue">
                    {report.groups.map((group, index) => (
                      <span key={index}>
                        <Tag title={group.title} color={group.color.title} isRemovable={false} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="report-details--body">
              <div className="report-details-container-bottom">
                <div className="report-details-item">
                  <div className="report-details-item--title">Actual result</div>
                  <div className="report-details-item--value">{report.actual_result}</div>
                </div>
                <div className="report-details-item">
                  <div className="report-details-item--title">Description</div>
                  <div className="report-details-item--value">{report.description}</div>
                </div>
                <div className="report-details-item">
                  <div className="report-details-item--title">Precondition</div>
                  <div className="report-details-item--value">{report.preconditions}</div>
                </div>
                <div className="report-details-item">
                  <div className="report-details-item--title">Test Steps</div>

                  {report.steps.map((step, index) => (
                    <div className="report-details-item--value" key={index}>
                      <span>
                        {`${index + 1}. `}
                        {step.step}

                        <div className="report-details-item--value-muted" key={index}>
                          {!isEmpty(step.input_data) ? `Input data:  ${step.input_data}` : ""}
                        </div>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="report-details-item">
                  <div className="report-details-item--title">Expected Result</div>
                  <div className="report-details-item--value">{report.expected_result}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="report-details-values">
            <div className="report-details-values--header">
              <div className="report-details-values-container-top">
                <div className="report-details-values-header">
                  <div className="report-details-values-header--title">
                    {moment(report.create_at).format("YYYY-MM-DD HH:mm:ss")}
                  </div>
                  <div className="report-details-values-header--value">{`Status: ${report.status.title}`}</div>
                  <br />
                  <div className="report-details-values-header--subvalue">
                    Tested by: {`${report.user.first_name} ${report.user.last_name}`}
                  </div>
                </div>
              </div>
            </div>
            <div className="report-details-values--body">
              <div className="report-details-values-container-bottom">
                <div className="report-details-values-item">
                  <div className="report-details-values-item--title">Devices</div>
                  <div className="report-details-values-item--value">
                    {report.reportsetup.device && report.reportsetup.device.title}
                  </div>
                </div>
                <div className="report-details-values-item">
                  <div className="report-details-values-item--title">Versions</div>
                  <div className="report-details-values-item--value">
                    {report.reportsetup.version && report.reportsetup.version.version}
                  </div>
                </div>
                <div className="report-details-values-item">
                  <div className="report-details-values-item--title">Browser</div>
                  <div className="report-details-values-item--value">
                    {report.reportsetup.browser && report.reportsetup.browser.title}
                  </div>
                </div>
                <div className="report-details-values-item">
                  <div className="report-details-values-item--title">Operating System</div>
                  <div className="report-details-values-item--value">
                    {report.reportsetup.operatingsystem && report.reportsetup.operatingsystem.title}
                  </div>
                </div>
                <div className="report-details-item">
                  <div className="report-details-item--title">Environment</div>
                  <div className="report-details-item--value">
                    {report.reportsetup.environment && report.reportsetup.environment.title}
                  </div>
                </div>
                <div className="report-details-item">
                  <div className="report-details-item--title">Additional Precondition</div>
                  <div className="report-details-item--value">{report.additional_precondition}</div>
                </div>
                <div className="report-details-item">
                  <div className="report-details-item--title">Comment</div>
                  <div className="report-details-item--value">{report.comment}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-arrow-left"></i>}
            title={"Back to All Reports"}
            link={`/${this.props.match.params.projectId}/Reports`}
            canGoBack={true}
          />
          {/* {content} */}
          <div className="report-details">
            <div className="report-details-row">
              <div className="report-details-row-half">
                <div className="report-details-row-half-header">
                  <div className="report-details-row-half-header-value">Test Case</div>
                </div>
              </div>
              <div className="report-details-row-half FAILED-REPORT">
                <div className="report-details-row-half-header">
                  <div className="report-details-row-half-header-value">Report</div>
                </div>
              </div>
            </div>
            <div className="report-details-row">
              <div className="report-details-row-half">
                <div className="report-details-row-half-title">Title</div>
                <div className="report-details-row-half-value">ime test casea</div>
              </div>
              <div className="report-details-row-half FAILED-REPORT">
                <div className="report-details-row-half-title">Status</div>
                <div className="report-details-row-half-value">Passed</div>
              </div>
            </div>
            <div className="report-details-row">
              <div className="report-details-row-half">
                <div className="report-details-row-half-title">Date</div>
                <div className="report-details-row-half-value">12.02.2019</div>
              </div>
              <div className="report-details-row-half FAILED-REPORT">
                <div className="report-details-row-half-title">Date</div>
                <div className="report-details-row-half-value">20.01.2020</div>
              </div>
            </div>
            <div className="report-details-row">
              <div className="report-details-row-half">
                <div className="report-details-row-half-title">User</div>
                <div className="report-details-row-half-value">Aleksandar Pavlovic</div>
              </div>
              <div className="report-details-row-half FAILED-REPORT">
                <div className="report-details-row-half-title">User</div>
                <div className="report-details-row-half-value">Jana Antic</div>
              </div>
            </div>
            <div className="report-details-row">
              <div className="report-details-row-full">
                <div className="report-details-row-full-title">Groups</div>
                <div className="report-details-row-full-value">grupe</div>
              </div>
            </div>

            <div className="report-details-row">
              <div className="report-details-row-half">
                <div className="report-details-row-half-title">Precondition</div>
                <div className="report-details-row-half-value">precondition</div>
              </div>
              <div className="report-details-row-half FAILED-REPORT">
                <div className="report-details-row-half-title ">Additional Precondition</div>
                <div className="report-details-row-half-value">dodatni precondition</div>
              </div>
            </div>
            <div className="report-details-row">
              <div className="report-details-row-half">
                <div className="report-details-row-half-title">Expected Result</div>
                <div className="report-details-row-half-value">ocekivani rezultat</div>
              </div>
              <div className="report-details-row-half FAILED-REPORT">
                <div className="report-details-row-half-title">Actual Result</div>
                <div className="report-details-row-half-value">rezultat</div>
              </div>
            </div>

            <div className="report-details-row">
              <div className="report-details-row-full">
                <div className="report-details-row-full-title">Description</div>
                <div className="report-details-row-full-value">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean
                  massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec
                  quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec
                  pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a,
                  venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.
                </div>
              </div>
            </div>
            <div className="report-details-row">
              <div className="report-details-row-half">
                <div className="report-details-row-half-title">Test Steps</div>
                <div className="report-details-row-half-value">
                  1. step1 <br /> 2. step2 <br /> 3. step3
                </div>
              </div>
              <div className="report-details-row-half FAILED-REPORT">
                <div className="report-details-row-half-title">Steps Input Data</div>
                <div className="report-details-row-half-value">
                  1. step1 <br /> 2. step2 <br /> 3. step3
                </div>
              </div>
            </div>
            <div className="report-details-row">
              <div className="report-details-row-half">
                <div className="report-details-row-half-title">Links</div>
                <div className="report-details-row-half-value">https://www.google.com</div>
              </div>
              <div className="report-details-row-half FAILED-REPORT">
                <div className="report-details-row-half-title">Links</div>
                <div className="report-details-row-half-value">https://www.google.com</div>
              </div>
            </div>
            <div className="report-details-row">
              <div className="report-details-row-half FAILED-REPORT">
                <div className="report-details-row-half-title">Device</div>
                <div className="report-details-row-half-value">iPhone 7</div>
              </div>
              <div className="report-details-row-half FAILED-REPORT">
                <div className="report-details-row-half-title">Browser</div>
                <div className="report-details-row-half-value">Google Chrome</div>
              </div>
            </div>
            <div className="report-details-row">
              <div className="report-details-row-half FAILED-REPORT">
                <div className="report-details-row-half-title">Version</div>
                <div className="report-details-row-half-value">2.1</div>
              </div>
              <div className="report-details-row-half FAILED-REPORT">
                <div className="report-details-row-half-title">Operating System</div>
                <div className="report-details-row-half-value">iOS</div>
              </div>
            </div>
            <div className="report-details-row">
              <div className="report-details-row-half FAILED-REPORT">
                <div className="report-details-row-half-title">Environment</div>
                <div className="report-details-row-half-value">Development</div>
              </div>
            </div>
            <div className="report-details-row-full">
              <div className="report-details-row-full FAILED-REPORT">
                <div className="report-details-row-full-title">Comment</div>
                <div className="report-details-row-full-value">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean
                  massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec
                  quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec
                  pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a,
                  venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Report.propTypes = {
  reports: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  reports: state.reports
});

export default connect(mapStateToProps, { getReport })(withRouter(Report));
