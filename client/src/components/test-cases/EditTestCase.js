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
      arrayValue: [],
      title: "Check all the optional fields when do not fill data",
      description:
        "It taught me how to let go of any creative ego, which has little space to breath when your work is put through its paces in real world scenarios — it keeps everyone honest and ensures our ideas are being validated throughout the process.",
      expected_result: "Successfully logged in",
      groups: []
    };
    this.selectOption = this.selectOption.bind(this);
    this.selectMultipleOption = this.selectMultipleOption.bind(this);
    this.onChange = this.onChange.bind(this);
    // this.onChangeTextarea = this.onChangeTextarea.bind(this);
    // this.onChange = this.onChange.bind(this);
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

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      console.log(this.state);
    });
  }
  onChangeSwitch(e, value) {
    this.setState({ [e.target.name]: value }, () => {
      console.log(this.state);
    });
  }
  //   onChange(e) {
  //     console.log(e);
  //   }
  //   onChangeTextarea(e) {
  //     console.log(e.target.value);
  //   }
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
                value={this.state.title}
                onChange={e => this.onChange(e)}
                name={"title"}
              />
              <Textarea
                placeholder="Enter Test Case Description"
                label="Description*"
                // validationMsg="Description is a required field"
                value={this.state.description}
                onChange={e => this.onChange(e)}
                name={"description"}
              />
              <Input
                type="text"
                addColumnPlaceholder="Add test steps"
                placeholder="Enter Test Steps Here"
                label="Test steps*"
                // validationMsg="At least one test step is required"
                value="Enter valid data in required fields"
                onChange={e => this.onChange(e)}
              />
              <Input
                type="text"
                placeholder="Enter Result"
                label="Expected Result*"
                // validationMsg="Expected result is a required field"
                value={this.state.expected_result}
                onChange={e => this.onChange(e)}
                name={"expected_result"}
              />
              <SearchDropdown
                value={this.state.arrayValue}
                options={bigList}
                onChange={this.selectMultipleOption}
                placeholder={"Test Group"}
                label={"Add to group*"}
              />
              <div className="group-grid">
                <Switch
                  label="Health Check"
                  value={this.state.healthCheck}
                  onChange={e =>
                    this.onChangeSwitch(e, !this.state.healthCheck)
                  }
                  name={"healthCheck"}
                />
                <Switch
                  label="Automated"
                  checked={true}
                  onChange={e => this.onChangeSwitch(e)}
                  name={"automated"}
                />
                <Switch
                  label="API"
                  checked={false}
                  onChange={e => this.onChangeSwitch(e)}
                  name={"api"}
                />
                <Switch
                  label="UI"
                  checked={true}
                  onChange={e => this.onChangeSwitch(e)}
                  name={"ui"}
                />
              </div>

              <Input
                type="text"
                addColumnPlaceholder="Add test steps"
                placeholder="Enter Condition"
                label="Precondition"
                value="User has internet connection"
                onChange={e => this.onChange(e)}
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
