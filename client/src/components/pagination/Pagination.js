import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getProjects } from "../../actions/projectActions";
import { getTestcases } from "../../actions/testcaseActions";

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
    console.log(e);

    var page = 0;
    var currentPage = this.props.page;
    if (e === 0) {
      page = 0;
    } else if (e === 1) {
      page = currentPage - 1;
    } else if (e === 2) {
      if (!isNaN(this.props.pageCount)) {
        page = currentPage + 1;
      }
    } else if (e === 3) {
      page = parseInt(this.props.pageCount) - 1;
    }
    if (this.props.match.url === "/Projects") {
      this.props.getProjects(this.props.searchTerm, page);
    } else if (this.props.match.url === "/1/TestCases") {
      this.props.getTestcases(this.state.projectId, this.props.settings.settings, page);
    }
  }
  newPagePredefined(e) {
    console.log(e.target.textContent);
    var page = 0;
    if (!isNaN(e.target.textContent)) {
      page = parseInt(e.target.textContent) - 1;
    }
    if (this.props.match.url === "/Projects") {
      this.props.getProjects(this.props.searchTerm, page);
    } else if (this.props.match.url === "/1/TestCases") {
      this.props.getTestcases(this.state.projectId, this.props.settings.settings, page);
    }
  }

  render() {
    var currentPage = 0;
    var pageCount = 0;
    if (!isNaN(this.props.page)) {
      currentPage = parseInt(this.props.page);
    }
    if (!isNaN(this.state.pageCount)) {
      pageCount = parseInt(this.state.pageCount);
    }
    var backPageBtnClass = "";
    var forwardPageBtnClass = "";
    var firstPageBtnClass = "";
    var lastPageBtnClass = "";

    if (currentPage < 1) {
      firstPageBtnClass = "disabled-page";
      backPageBtnClass = "disabled-page";
    }

    if (currentPage + 1 >= pageCount) {
      forwardPageBtnClass = "disabled-page";
      lastPageBtnClass = "disabled-page";
    }

    var counter = 0;
    var content = [];

    while (counter < this.state.pageCount) {
      content.push(
        <div
          key={counter}
          className={`pagination-items--item ${currentPage === counter ? "active-page" : ""}`}
          onClick={this.newPagePredefined}
        >
          {counter + 1}
        </div>
      );
      counter++;
    }
    return (
      <div className="pagination">
        <div className="pagination-items">
          <div className={`pagination-items--item ${firstPageBtnClass}`} onClick={e => this.newPage(0)}>
            <i className="fas fa-backward"></i>
          </div>

          <div className={`pagination-items--item ${backPageBtnClass}`} onClick={e => this.newPage(1)}>
            <i className="fas fa-step-backward"></i>
          </div>
          {content}
          <div className={`pagination-items--item ${forwardPageBtnClass}`} onClick={e => this.newPage(2)}>
            <i className="fas fa-step-forward"></i>
          </div>
          <div className={`pagination-items--item ${lastPageBtnClass}`} onClick={e => this.newPage(3)}>
            <i className="fas fa-forward"></i>
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
  settings: state.settings
});

export default connect(
  mapStateToProps,
  { getTestcases, getProjects }
)(withRouter(Pagination));
