import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import GlobalPanel from "../global-panel/GlobalPanel";
import ProjectPanel from "../project-panel/ProjectPanel";
import BtnAnchor from "../common/BtnAnchor";
import FilterBtn from "../common/FilterBtn";
import Header from "../common/Header";
import SearchBtn from "../common/SearchBtn";
import FilterContainer from "../filters/FilterContainer";
import TestCaseContainer from "../test-cases/TestCaseContainer";

class TestCases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: "",
      values: "",
      showFilters: true,
      value: null,
      arrayValue: []
    };
    this.filterBtn = this.filterBtn.bind(this);
  }
  filterBtn() {
    var showFilters;
    if (this.state.showFilters) {
      showFilters = false;
    } else {
      showFilters = true;
    }
    this.setState({ showFilters });
  }
  render() {
    var filters = "";
    if (this.state.showFilters) {
      filters = <FilterContainer />;
    }

    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-clipboard-list"></i>}
            title={"Test Cases"}
            link={"CreateTestCase"}
            canGoBack={false}
            addBtn={
              <BtnAnchor type={"text"} label="Add New" className={"a-btn a-btn-primary"} link={`CreateTestCase`} />
            }
            filterBtn={<FilterBtn onClick={this.filterBtn} />}
            searchBtn={<SearchBtn />}
          />
          {filters}
          <TestCaseContainer />
        </div>
      </div>
    );
  }
}

TestCases.propTypes = {
  testcases: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases
  // auth: state.auth,
});

export default connect(
  mapStateToProps,
  {}
)(withRouter(TestCases));
