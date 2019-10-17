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
    var counter = 0;
    var content = [];
    while (counter < this.state.pageCount) {
      content.push(
        <Link key={counter} to={`/${this.props.projectId}/TestCases/${counter}`}>
          <div className="pagination-items--item">{counter + 1}</div>
        </Link>
      );
      counter++;
    }
    return (
      <div className="pagination">
        <div className="pagination-items">
          <div className="pagination-items--item">
            <i className="fas fa-backward"></i>
          </div>
          <div className="pagination-items--item">
            <i className="fas fa-step-backward"></i>
          </div>
          {content}
          <div className="pagination-items--item">
            <i className="fas fa-step-forward"></i>
          </div>
          <div className="pagination-items--item">
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
  { getTestcases }
)(withRouter(Pagination));
