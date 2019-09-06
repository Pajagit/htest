import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import GlobalPanel from "../components/global-panel/GlobalPanel";
import ProjectPanel from "../components/project-panel/ProjectPanel";
import BtnAnchor from "../components/common/BtnAnchor";
import FilterBtn from "../components/common/FilterBtn";
import Header from "../components/common/Header";
import SearchBtn from "../components/common/SearchBtn";
import FilterContainer from "../components/filters/FilterContainer";
import TestCaseContainer from "../components/test-cases/TestCaseContainer";

import { getTestcases } from "../actions/testcaseActions";

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

    //   this.onChange = this.onChange.bind(this);
    //   this.selectOption = this.selectOption.bind(this);
    this.filterBtn = this.filterBtn.bind(this);
  }
  componentDidMount() {
    this.props.getTestcases();
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
  { getTestcases }
)(withRouter(TestCases));
