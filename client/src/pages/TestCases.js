import React, { Component } from "react";
import GlobalPanel from "../components/global-panel/GlobalPanel";
import ProjectPanel from "../components/project-panel/ProjectPanel";
import BtnAnchor from "../components/common/BtnAnchor";
import FilterBtn from "../components/common/FilterBtn";
import Header from "../components/common/Header";
import SearchBtn from "../components/common/SearchBtn";
import FilterContainer from "../components/filters/FilterContainer";
import TestCaseContainer from "../components/test-cases/TestCaseContainer";

export default class TestCases extends Component {
  render() {
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
              <BtnAnchor
                type={"text"}
                label="Add New"
                className={"a-btn a-btn-primary"}
                link={`CreateTestCase`}
              />
            }
            filterBtn={<FilterBtn />}
            searchBtn={<SearchBtn />}
          />
          <FilterContainer />
          <TestCaseContainer />
        </div>
      </div>
    );
  }
}
