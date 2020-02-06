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
                    {report.user.first_name} {report.user.last_name}{" "}
                    {report.user.position ? ", " + report.user.position : ""}
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
          {content}
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
