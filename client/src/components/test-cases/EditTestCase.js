import React, { Component } from "react";
import Btn from "../common/Btn";
import FullBtn from "../common/FullBtn";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Switch from "../common/Switch";
import Checkbox from "../common/Checkbox";
import GlobalPanel from "../global-panel/GlobalPanel";
import ProjectPanel from "../project-panel/ProjectPanel";
import Header from "../common/Header";
import UnderlineAnchor from "../common/UnderlineAnchor";

import SearchDropdown from "../common/SearchDropdown";
const bigList = [];

for (var i = 1; i <= 1000; i++) {
  bigList.push({ id: i, name: `Item ${i}` });
}
class EditTestCase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: "",
      value: null,
      arrayValue: []
    };
    this.selectOption = this.selectOption.bind(this);
    this.selectMultipleOption = this.selectMultipleOption.bind(this);
  }

  selectOption(value) {
    console.log("Vals", value);
    this.setState({ value });
  }
  selectMultipleOption(value) {
    console.count("onChange");
    console.log("Val", value);
    this.setState({ arrayValue: value });
  }

  render() {
    var bigList = [];
    bigList.push(
      { id: 1, name: "Health Check" },
      { id: 2, name: "Automation" },
      { id: 3, name: "Regression" },
      { id: 4, name: "API" },
      { id: 5, name: "UI" }
    );
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-arrow-left"></i>}
            title={"Back to Test Case"}
            history={this.props}
            canGoBack={true}
          />
          <div className="main-content--content">
            {/* <div className="main-content--content-header">Edit Test Case</div> */}
            <div>
              <Input
                type="text"
                placeholder="Enter Test Case Name"
                label="Test case name*"
                // validationMsg="Test case name is a required field"
                value="Check all the optional fields when do not fill data"
              />
              <Textarea
                placeholder="Enter Test Case Description"
                label="Description*"
                // validationMsg="Description is a required field"
                value="It taught me how to let go of any creative ego, which has little space to breath when your work is put through its paces in real world scenarios — it keeps everyone honest and ensures our ideas are being validated throughout the process."
              />
              <Input
                type="text"
                addColumnPlaceholder="Add test steps"
                placeholder="Enter Test Steps Here"
                label="Test steps*"
                // validationMsg="At least one test step is required"
                value="Enter valid data in required fields"
              />
              <Input
                type="text"
                placeholder="Enter Result"
                label="Expected Result*"
                // validationMsg="Expected result is a required field"
                value="Successfully logged in"
              />
              <SearchDropdown
                value={this.state.arrayValue}
                options={bigList}
                onChange={this.selectMultipleOption}
                placeholder={"Test Group"}
                label={"Add to group*"}
              />
              <div className="group-grid">
                <Switch label="Health Check" checked={true} />
                <Switch label="Automated" checked={true} />
                <Switch label="API" checked={false} />
                <Switch label="UI" checked={true} />
              </div>

              <Input
                type="text"
                addColumnPlaceholder="Add test steps"
                placeholder="Enter Condition"
                label="Precondition"
                value="User has internet connection"
              />
              <FullBtn
                className="full-width-btn"
                placeholder="Add Links"
                label="Links"
                icon="text"
              />
              <FullBtn
                className="full-width-btn"
                placeholder="Add Files"
                label="Upload Files"
                icon="text"
              />
              <div className="flex-column-left mt-4">
                <Btn
                  className="btn btn-primary mr-2"
                  label="Save Changes"
                  type="text"
                />

                <UnderlineAnchor link={"TestCases"} value={"Cancel"} />
              </div>
              <Checkbox label="Set old test case as deprecated" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default EditTestCase;
