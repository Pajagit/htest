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
import openExternalBtn from "../../../img/openExternalBtn.png";
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
      content = (
        <div>
          <div className='report-details'>
            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-header'>
                  <div className='report-details-row-half-header-value'>Test Case</div>
                </div>
              </div>
              <div className={`report-details-row-half ${report.status.title.toUpperCase()}-REPORT`}>
                <div className='report-details-row-half-header'>
                  <div className='report-details-row-half-header-value'>Report</div>
                </div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-title'>Title</div>
                <div className='report-details-row-half-value'>{report.testcase.title}</div>
              </div>
              <div className={`report-details-row-half ${report.status.title.toUpperCase()}-REPORT`}>
                <div className='report-details-row-half-title'>Status</div>
                <div className='report-details-row-half-value'>{report.status.title}</div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-title'>Test Case Created</div>
                <div className='report-details-row-half-value'>
                  {moment(report.testcase.created_at).format("Do MMMM YYYY, h:mm:ss a")}
                </div>
              </div>
              <div className={`report-details-row-half ${report.status.title.toUpperCase()}-REPORT`}>
                <div className='report-details-row-half-title'>Reported</div>
                <div className='report-details-row-half-value'>
                  {moment(report.created_at).format("Do MMMM YYYY, h:mm:ss a")}
                </div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-title'>Created By</div>
                <div className='report-details-row-half-value'>
                  {report.testcase.user.first_name +
                    " " +
                    report.testcase.user.last_name +
                    " - " +
                    report.testcase.user.email}
                </div>
              </div>
              <div className={`report-details-row-half ${report.status.title.toUpperCase()}-REPORT`}>
                <div className='report-details-row-half-title'>Tested By</div>
                <div className='report-details-row-half-value'>
                  {report.user.first_name + " " + report.user.last_name + " - " + report.user.email}
                </div>
              </div>
            </div>

            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-title'>Precondition</div>
                <div className='report-details-row-half-value'>{report.testcase.preconditions}</div>
              </div>
              <div className={`report-details-row-half ${report.status.title.toUpperCase()}-REPORT`}>
                <div className='report-details-row-half-title '>Additional Precondition</div>
                <div className='report-details-row-half-value'>{report.additional_precondition}</div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-title'>Expected Result</div>
                <div className='report-details-row-half-value'>{report.testcase.expected_result}</div>
              </div>
              <div className={`report-details-row-half ${report.status.title.toUpperCase()}-REPORT`}>
                <div className='report-details-row-half-title'>Actual Result</div>
                <div className='report-details-row-half-value'>{report.actual_result}</div>
              </div>
            </div>

            <div className='report-details-row'>
              <div className='report-details-row-full'>
                <div className='report-details-row-full-title'>Description</div>
                <div className='report-details-row-full-value'>{report.testcase.description}</div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className='report-details-row-full'>
                <div className='report-details-row-full-title'>Groups</div>
                <div className='report-details-row-full-value'>
                  {report.testcase.groups.map((group, groupIndex) => (
                    <React.Fragment key={groupIndex}>
                      <Tag title={group.title} color={group.color.title} isRemovable={false} />
                    </React.Fragment>
                  ))}
                </div>
                <br />
              </div>
            </div>

            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-title'>Test Steps</div>
                <div className='report-details-row-half-value'>
                  {report.testcase.steps.map((test_step, index) => (
                    <div key={index}>
                      <span>
                        <b>
                          {`Step ${index + 1}. `}
                          {test_step.value}
                        </b>
                        <br />
                        <i>{!isEmpty(test_step.expected_result) ? `Expected: ${test_step.expected_result}` : ""}</i>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`report-details-row-half ${report.status.title.toUpperCase()}-REPORT`}>
                <div className='report-details-row-half-title'>Steps Input Data</div>
                <div className='report-details-row-half-value'>
                  {report.steps.map((step, index) => (
                    <div key={index}>
                      <span>
                        {`${index + 1}. `}
                        {!isEmpty(step.input_data) ? `${step.input_data}` : "/"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className='report-details-row-half'>
                <div className='report-details-row-half-title'>Links</div>
                <div className='report-details-row-half-value'>
                  {report.testcase.links.map((link, index) => (
                    <div key={index}>
                      <span>
                        {`${index + 1}. `}
                        <a href={link.value} target='_blank' rel='noopener noreferrer'>
                          <span className='mr-1'>{link.value}</span>
                          <img className='testcase-details-item--value-img' src={openExternalBtn} alt='External link' />
                        </a>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`report-details-row-half ${report.status.title.toUpperCase()}-REPORT`}>
                <div className='report-details-row-half-title'>Links</div>
                <div className='report-details-row-half-value'>
                  {report.links.map((link, index) => (
                    <div key={index}>
                      <span>
                        {`${index + 1}. `}
                        <a href={link.value} target='_blank' rel='noopener noreferrer'>
                          <span className='mr-1'>{link.value}</span>
                          <img className='testcase-details-item--value-img' src={openExternalBtn} alt='External link' />
                        </a>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='report-details-row'>
              <div className={`report-details-row-half ${report.status.title.toUpperCase()}-REPORT`}>
                <div className='report-details-row-half-title'>Device</div>
                <div className='report-details-row-half-value'>
                  {report.reportsetup.device ? report.reportsetup.device.title : ""}
                </div>
              </div>
              <div className={`report-details-row-half ${report.status.title.toUpperCase()}-REPORT`}>
                <div className='report-details-row-half-title'>Browser</div>
                <div className='report-details-row-half-value'>
                  {report.reportsetup.browser ? report.reportsetup.browser.title : ""}
                </div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className={`report-details-row-half ${report.status.title.toUpperCase()}-REPORT`}>
                <div className='report-details-row-half-title'>Version</div>
                <div className='report-details-row-half-value'>
                  {report.reportsetup.version ? report.reportsetup.version.version : ""}
                </div>
              </div>
              <div className={`report-details-row-half ${report.status.title.toUpperCase()}-REPORT`}>
                <div className='report-details-row-half-title'>Operating System</div>
                <div className='report-details-row-half-value'>
                  {report.reportsetup.operatingsystem ? report.reportsetup.operatingsystem.title : ""}
                </div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className={`report-details-row-half ${report.status.title.toUpperCase()}-REPORT`}>
                <div className='report-details-row-half-title'>Environment</div>
                <div className='report-details-row-half-value'>
                  {report.reportsetup.environment ? report.reportsetup.environment.title : ""}
                </div>
              </div>
              <div className={`report-details-row-half ${report.status.title.toUpperCase()}-REPORT`}>
                <div className='report-details-row-half-title'>Simulator</div>
                <div className='report-details-row-half-value'>
                  {report.reportsetup.simulator ? report.reportsetup.simulator.title : ""}
                </div>
              </div>
            </div>
            <div className='report-details-row'>
              <div className='report-details-row-full'>
                <div className={`report-details-row-full ${report.status.title.toUpperCase()}-REPORT`}>
                  <div className='report-details-row-full-title'>Comment</div>
                  <div className='report-details-row-full-value'>{report.comment}</div>
                </div>
              </div>
            </div>
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
            icon={<i className='fas fa-arrow-left'></i>}
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
