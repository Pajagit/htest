import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";

import { getProjects } from "../../actions/projectActions";
import { getTestcases } from "../../actions/testcaseActions";
import { getReports } from "../../actions/reportActions";

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCount: this.props.pageCount,
      projectId: this.props.projectId,
      settings: this.props.settings,
      page: this.props.page
    };
    this.newPagePredefined = this.newPagePredefined.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};

    if (nextProps.pageCount !== prevState.pageCount) {
      update.pageCount = nextProps.pageCount;
    }
    if (nextProps.projectId !== prevState.projectId) {
      update.projectId = nextProps.projectId;
    }

    if (nextProps.page !== prevState.page) {
      update.page = nextProps.page;
    }

    return Object.keys(update).length ? update : null;
  }
  newPage(e) {
    var page = 1;
    var currentPage = parseInt(this.props.page);
    if (e === 0) {
      page = 1;
    } else if (e === 1) {
      page = currentPage - 1;
    } else if (e === 2) {
      if (!isNaN(this.props.pageCount)) {
        page = currentPage + 1;
      }
    } else if (e === 3) {
      page = parseInt(this.props.pageCount);
    }

    var reportFilters = {};
    if (this.state.settings.report_settings) {
      reportFilters = this.state.settings.report_settings;

      reportFilters.date_from =
        this.state.settings.report_settings && this.state.settings.report_settings.date_from
          ? moment(this.state.settings.report_settings.date_from).format("YYYY-MM-DD")
          : null;
      reportFilters.date_to = this.state.settings.report_settings.date_to
        ? moment(this.state.settings.report_settings.date_to).format("YYYY-MM-DD")
        : null;
    }

    var testcaseFilters = {};
    if (this.state.settings.testcase_settings) {
      testcaseFilters = this.state.settings.testcase_settings;
      testcaseFilters.date_from =
        this.state.settings.testcase_settings && this.state.settings.testcase_settings.date_from
          ? moment(this.state.settings.testcase_settings.date_from).format("YYYY-MM-DD")
          : null;
      testcaseFilters.date_to = this.state.settings.testcase_settings.date_to
        ? moment(this.state.settings.testcase_settings.date_to).format("YYYY-MM-DD")
        : null;
    }
    if (this.props.match.url === "/Projects") {
      this.props.getProjects(this.props.searchTerm, page);
    } else if (this.props.match.url === `/${this.state.projectId}/TestCases`) {
      this.props.getTestcases(this.state.projectId, testcaseFilters, page);
    } else if (this.props.match.url === `/${this.state.projectId}/Reports`) {
      this.props.getReports(this.state.projectId, reportFilters, page);
    }
  }
  newPagePredefined(e) {
    var page = 1;
    if (!isNaN(e.target.textContent)) {
      page = parseInt(e.target.textContent);
    }
    var reportFilters = {};
    if (this.state.settings.report_settings) {
      reportFilters = this.state.settings.report_settings;

      reportFilters.date_from =
        this.state.settings.report_settings && this.state.settings.report_settings.date_from
          ? moment(this.state.settings.report_settings.date_from).format("YYYY-MM-DD")
          : null;
      reportFilters.date_to = this.state.settings.report_settings.date_to
        ? moment(this.state.settings.report_settings.date_to).format("YYYY-MM-DD")
        : null;
    }

    var testcaseFilters = {};
    if (this.state.settings.testcase_settings) {
      testcaseFilters = this.state.settings.testcase_settings;
      testcaseFilters.date_from =
        this.state.settings.testcase_settings && this.state.settings.testcase_settings.date_from
          ? moment(this.state.settings.testcase_settings.date_from).format("YYYY-MM-DD")
          : null;
      testcaseFilters.date_to = this.state.settings.testcase_settings.date_to
        ? moment(this.state.settings.testcase_settings.date_to).format("YYYY-MM-DD")
        : null;
    }

    if (this.props.match.url === "/Projects") {
      this.props.getProjects(this.props.searchTerm, page);
    } else if (this.props.match.url === `/${this.state.projectId}/TestCases`) {
      this.props.getTestcases(this.state.projectId, testcaseFilters, page);
    } else if (this.props.match.url === `/${this.state.projectId}/Reports`) {
      this.props.getReports(this.state.projectId, reportFilters, page);
    }
  }

  render() {
    var currentPage = 1;
    var apiReturnedPages = 1;
    var pagesToRender = 0;
    var calculatedNumberOfPagesThatCanBeShown = pageBtnWidth => {
      return Math.round(pageBtnWidth / 53 - 5);
    };

    var calculatedNumberOfPagesOneDirection = numberOfPagesThatCanBeShown => {
      return Math.round(numberOfPagesThatCanBeShown / 2);
    };
    var widthAllowedPages = calculatedNumberOfPagesThatCanBeShown(this.props.width);
    if (!isNaN(this.props.page)) {
      currentPage = parseInt(this.props.page);
    }
    if (!isNaN(this.state.pageCount)) {
      apiReturnedPages = parseInt(this.state.pageCount);
    }

    if (widthAllowedPages < apiReturnedPages) {
      pagesToRender = widthAllowedPages;
    } else {
      pagesToRender = apiReturnedPages;
    }

    var firstPageToRender = currentPage - Math.round(widthAllowedPages / 2);

    if (firstPageToRender > apiReturnedPages - pagesToRender) {
      firstPageToRender = apiReturnedPages - pagesToRender;
    }
    if (currentPage + calculatedNumberOfPagesOneDirection(pagesToRender) > apiReturnedPages) {
      firstPageToRender = apiReturnedPages - calculatedNumberOfPagesThatCanBeShown(this.props.width);
    }
    if (firstPageToRender < 1) {
      firstPageToRender = 1;
    }

    var backPageBtnClass = "";
    var forwardPageBtnClass = "";
    var firstPageBtnClass = "";
    var lastPageBtnClass = "";

    if (currentPage <= 1) {
      firstPageBtnClass = "disabled-page";
      backPageBtnClass = "disabled-page";
    }

    if (currentPage >= apiReturnedPages) {
      forwardPageBtnClass = "disabled-page";
      lastPageBtnClass = "disabled-page";
    }

    var content = [];

    var pageIndex = firstPageToRender;

    if (apiReturnedPages > pagesToRender) {
      pagesToRender = pagesToRender + 1;
    }
    var pageCounter = pagesToRender;

    while (pageCounter > 0) {
      content.push(
        <div
          key={pageIndex}
          className={`pagination-items--item ${currentPage === pageIndex ? "active-page" : ""}`}
          onClick={this.newPagePredefined}
        >
          {pageIndex}
        </div>
      );
      pageIndex++;
      pageCounter--;
    }

    return (
      <div className='pagination'>
        <div className='pagination-items'>
          <div className={`pagination-items--item ${firstPageBtnClass}`} onClick={e => this.newPage(0)}>
            <i className='fas fa-backward'></i>
          </div>

          <div className={`pagination-items--item ${backPageBtnClass}`} onClick={e => this.newPage(1)}>
            <i className='fas fa-step-backward'></i>
          </div>
          {content}
          <div className={`pagination-items--item ${forwardPageBtnClass}`} onClick={e => this.newPage(2)}>
            <i className='fas fa-step-forward'></i>
          </div>
          <div className={`pagination-items--item ${lastPageBtnClass}`} onClick={e => this.newPage(3)}>
            <i className='fas fa-forward'></i>
          </div>
        </div>
      </div>
    );
  }
}
Pagination.propTypes = {
  testcases: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases,
  reports: state.reports,
  settings: state.settings
});

export default connect(mapStateToProps, { getTestcases, getProjects, getReports })(withRouter(Pagination));
