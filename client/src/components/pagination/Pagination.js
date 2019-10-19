// import React from "react";

// export default function Pagination({ pageCount }) {

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

import { getTestcases } from "../../actions/testcaseActions";

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCount: this.props.pageCount,
      projectId: this.props.projectId,
      page: this.props.match.params.page
    };
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

  render() {
    var currentPage = 0;
    var pageCount = 0;
    if (!isNaN(this.props.page)) {
      currentPage = parseInt(this.props.page);
    }
    if (!isNaN(this.state.pageCount)) {
      pageCount = parseInt(this.state.pageCount);
    }
    var link = "";

    var backPageBtn = 0;
    var backPageBtnClass = "";

    var forwardPageBtn = 0;
    var forwardPageBtnClass = "";

    var firstPageBtn = 0;
    var firstPageBtnClass = "";

    var lastPageBtn = 0;
    var lastPageBtnClass = "";

    backPageBtn = currentPage - 1;
    forwardPageBtn = currentPage + 1;
    lastPageBtn = pageCount - 1;

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

    if (this.props.match.path === "/:projectId/TestCases/Page/:page") {
      link = `/${this.props.projectId}/TestCases/Page/`;
    }

    while (counter < this.state.pageCount) {
      content.push(
        <Link key={counter} to={`${link}${counter}`}>
          <div className={`pagination-items--item ${currentPage === counter ? "active-page" : ""}`}>{counter + 1}</div>
        </Link>
      );
      counter++;
    }
    return (
      <div className="pagination">
        <div className="pagination-items">
          <Link to={`${link}${firstPageBtn}`} className={firstPageBtnClass}>
            <div className="pagination-items--item">
              <i className="fas fa-backward"></i>
            </div>
          </Link>
          <Link to={`${link}${backPageBtn}`} className={backPageBtnClass}>
            <div className="pagination-items--item">
              <i className="fas fa-step-backward"></i>
            </div>
          </Link>
          {content}
          <Link to={`${link}${forwardPageBtn}`} className={forwardPageBtnClass}>
            <div className="pagination-items--item">
              <i className="fas fa-step-forward"></i>
            </div>
          </Link>
          <Link to={`${link}${lastPageBtn}`} className={lastPageBtnClass}>
            <div className="pagination-items--item">
              <i className="fas fa-forward"></i>
            </div>
          </Link>
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
  { getTestcases }
)(withRouter(Pagination));
