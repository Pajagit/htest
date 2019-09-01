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
            icon={<i className="fas fa-file-alt"></i>}
            title={"Test Cases"}
            link={"CreateTestCase"}
            canGoBack={false}
            addBtn={
              <BtnAnchor type={"text"} label="Add New" className={"a-btn a-btn-primary"} link={`CreateTestCase`} />
            }
            filterBtn={<FilterBtn />}
            searchBtn={<SearchBtn />}
          />
          <FilterContainer />
          <TestCaseContainer />
          {/* <div className="main-content--content"> */}
          {/* <div className="main-content--content-header">New Test Case</div> */}
          {/* <div>
              <Input
                type="text"
                placeholder="Enter Test Case Name"
                label="Test case name*"
                validationMsg="Test case name is a required field"
              />
              <Textarea
                placeholder="Enter Test Case Description"
                label="Description*"
                validationMsg="Description is a required field"
              />
              <Input
                type="text"
                addColumnPlaceholder="Add test steps"
                placeholder="Enter Test Steps Here"
                label="Test steps*"
                validationMsg="At least one test step is required"
              />
              <Input
                type="text"
                placeholder="Enter Result"
                label="Expected Result*"
                validationMsg="Expected result is a required field"
              />

              <div className="group-grid">
                <Switch label="Health Check" />
                <Switch label="Automated" />
                <Switch label="API" />
                <Switch label="UI" />
              </div>

              <Input
                type="text"
                addColumnPlaceholder="Add test steps"
                placeholder="Enter Condition"
                label="Precondition"
              />
              <FullBtn className="full-width-btn" placeholder="Add Links" label="Links" icon="text" />
              <FullBtn className="full-width-btn" placeholder="Add Files" label="Upload Files" icon="text" />
              <div className="flex-column-left mt-4">
                <Btn className="btn btn-primary mr-2" label="Save Test Case" type="text" />
                <Btn className="btn btn-primary mr-2" label="Add To Report" type="text" />
                <FormCancel link={"https://google.com"} value={"Cancel"} />
              </div>
              <Checkbox label="Add new Test case" />
            </div> */}
          {/* </div> */}
        </div>
      </div>
    );
  }
}
