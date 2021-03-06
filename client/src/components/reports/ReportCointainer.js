import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import PortraitReport from "../common/PortraitReport";
import LandscapeReport from "../common/LandscapeReport";
import Tag from "../common/Tag";
import Spinner from "../common/Spinner";
import isEmpty from "../../validation/isEmpty";
import Pagination from "../pagination/Pagination";
import moment from "moment";

import { getTestcases } from "../../actions/testcaseActions";
import { getReports } from "../../actions/reportActions";

class ReportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: this.props.settings.report_settings,
      filters: this.props.settings.report_settings,
      reports: this.props.reports.reports,
      initialRender: true,
      projectId: null,
      page: 0,
      dimensions: null
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    if (nextProps.settings && nextProps.settings.report_settings) {
      if (nextProps.settings.report_settings !== prevState.settings) {
        update.settings = nextProps.settings.report_settings;
        if (prevState.initialRender) {
          update.initialRender = false;
          var filters = nextProps.settings.report_settings;
          filters.date_from = nextProps.settings.report_settings.date_from
            ? moment(nextProps.settings.report_settings.date_from).format("YYYY-MM-DD")
            : null;
          filters.date_to = nextProps.settings.report_settings.date_to
            ? moment(nextProps.settings.report_settings.date_to).format("YYYY-MM-DD")
            : null;
          nextProps.getReports(nextProps.match.params.projectId, nextProps.settings.report_settings, 1);
        }
      }
    }

    if (nextProps.reports && nextProps.reports.reports) {
      update.reports = nextProps.reports.reports;
      if (nextProps.reports.reports.page !== prevState.page) {
        update.page = nextProps.reports.reports.page;
      }
    }
    return Object.keys(update).length ? update : null;
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({
      dimensions: {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight
      }
    });
  }
  render() {
    var projectId = this.props.match.params.projectId;
    var settingsLoading = this.props.settings.loading;
    var reports = this.props.reports;
    var { loading } = this.props.reports;
    var pageCount = null;
    var showPagination = false;
    if (reports.reports) {
      pageCount = reports.reports.pages;

      if (pageCount > 1) {
        showPagination = true;
      }
    }
    let content;
    let grid = "";
    var pagination = "";
    if (
      reports.reports === null ||
      loading ||
      this.state.settings === null ||
      settingsLoading ||
      this.state.dimensions === null
    ) {
      content = <Spinner />;
    } else if (reports.reports.reports.length > 0 && this.state.settings.view_mode === 1) {
      reports = this.props.reports.reports;
      if (showPagination) {
        pagination = (
          <Pagination
            pageCount={pageCount}
            page={this.state.page}
            searchTerm={this.state.searchTerm}
            projectId={projectId}
            width={this.state.dimensions && this.state.dimensions.width}
          />
        );
      }
      grid = "testcase-grid";
      content =
        reports.reports &&
        reports.reports.map((report, index) => (
          <React.Fragment key={index}>
            <PortraitReport
              isValidWrite={this.props.isValidWrite}
              title={report.testcase.title}
              tags={report.testcase.groups.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Tag title={group.title} color={group.color.title} isRemovable={false} />
                </React.Fragment>
              ))}
              author={report.user}
              deprecated={report.testcase.deprecated}
              date={report.created_at}
              comment={report.comment}
              actual_result={report.actual_result}
              status={report.status}
              device={[
                report.reportsetup.device !== null ? report.reportsetup.device : "/",
                report.reportsetup.device && report.reportsetup.device.deprecated
              ]}
              browser={[
                report.reportsetup.browser ? report.reportsetup.browser : "/",
                report.reportsetup.browser && report.reportsetup.browser.deprecated
              ]}
              version={[
                report.reportsetup.version ? report.reportsetup.version : "/",
                report.reportsetup.version && report.reportsetup.version.deprecated
              ]}
              operatingsystem={[
                report.reportsetup.operatingsystem !== null ? report.reportsetup.operatingsystem : "/",
                report.reportsetup.operatingsystem && report.reportsetup.operatingsystem.deprecated
              ]}
              environment={[
                report.reportsetup.environment !== null ? report.reportsetup.environment : "/",
                report.reportsetup.environment && report.reportsetup.environment.deprecated
              ]}
              simulator={[
                report.reportsetup.simulator !== null ? report.reportsetup.simulator : "/",
                report.reportsetup.simulator && report.reportsetup.simulator.deprecated
              ]}
              id={report.id}
              projectId={projectId}
              onClick={e => this.props.history.push(`/${projectId}/Report/${report.id}`)}
              onClickAddReport={e => {
                e.stopPropagation();
                this.props.history.push(`/${projectId}/Testcase/${report.testcase.id}/Report/${report.id}`);
              }}
            />
          </React.Fragment>
        ));
    } else if (reports.reports.reports.length > 0 && this.state.settings.view_mode === 2) {
      reports = this.props.reports.reports;
      if (showPagination) {
        pagination = (
          <Pagination
            pageCount={pageCount}
            page={this.state.page}
            searchTerm={this.state.searchTerm}
            projectId={projectId}
            width={this.state.dimensions.width}
          />
        );
      }
      grid = "testcase-grid grid-none";
      content =
        reports.reports &&
        reports.reports.map((report, index) => (
          <React.Fragment key={index}>
            <LandscapeReport
              title={report.testcase.title}
              tags={report.testcase.groups.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Tag title={group.title} color={group.color.title} isRemovable={false} />
                </React.Fragment>
              ))}
              author={report.user}
              deprecated={report.testcase.deprecated}
              date={report.created_at}
              comment={report.comment}
              actual_result={report.actual_result}
              status={report.status}
              device={[
                report.reportsetup.device !== null ? report.reportsetup.device : "/",
                report.reportsetup.device && report.reportsetup.device.deprecated
              ]}
              browser={[
                report.reportsetup.browser ? report.reportsetup.browser : "/",
                report.reportsetup.browser && report.reportsetup.browser.deprecated
              ]}
              version={[
                report.reportsetup.version ? report.reportsetup.version : "/",
                report.reportsetup.version && report.reportsetup.version.deprecated
              ]}
              operatingsystem={[
                report.reportsetup.operatingsystem !== null ? report.reportsetup.operatingsystem : "/",
                report.reportsetup.operatingsystem && report.reportsetup.operatingsystem.deprecated
              ]}
              environment={[
                report.reportsetup.environment !== null ? report.reportsetup.environment : "/",
                report.reportsetup.environment && report.reportsetup.environment.deprecated
              ]}
              simulator={[
                report.reportsetup.simulator !== null ? report.reportsetup.simulator : "/",
                report.reportsetup.simulator && report.reportsetup.simulator.deprecated
              ]}
              id={report.id}
              projectId={projectId}
              onClick={e => this.props.history.push(`/${projectId}/Report/${report.id}`)}
              onClickAddReport={e => {
                e.stopPropagation();
                this.props.history.push(`/${projectId}/Testcase/${report.testcase.id}/Report/${report.id}`);
              }}
              isValidWrite={this.props.isValidWrite}
            ></LandscapeReport>
          </React.Fragment>
        ));
    } else {
      if (
        !isEmpty(this.state.settings && this.state.settings.users) ||
        !isEmpty(this.state.settings && this.state.settings.groups) ||
        (this.state.settings && this.state.settings.date_from !== null) ||
        (this.state.settings && this.state.settings.date_to !== null)
      ) {
        content = (
          <div className='testcase-container-no-content padding'>There are no reports matching selected filters</div>
        );
      } else {
        content = (
          <div className='testcase-container-no-content padding'>There are no reports created for this project</div>
        );
      }
    }

    return (
      <div>
        <div ref={el => (this.container = el)} className={`${grid} testcase-container`}>
          {content}
        </div>
        {pagination}
      </div>
    );
  }
}

ReportContainer.propTypes = {
  testcases: PropTypes.object.isRequired,
  reports: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases,
  settings: state.settings,
  reports: state.reports
});

export default connect(mapStateToProps, { getTestcases, getReports })(withRouter(ReportContainer));
