import React, { Component } from "react";
import Btn from "../components/Btn";
import FullBtn from "../components/FullBtn";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Switch from "../components/Switch";
import Checkbox from "../components/Checkbox";
import GlobalPanel from "../components/GlobalPanel";
import ProjectPanel from "../components/ProjectPanel";
import Header from "../components/Header";

import SearchDropdown from "../components/SearchDropdown";
const bigList = [];

for (var i = 1; i <= 1000; i++) {
  bigList.push({ id: i, name: `Item ${i}` });
}
export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: "",
      // values: ""
      value: null,
      arrayValue: []
    };
    this.selectOption = this.selectOption.bind(this);
    this.selectMultipleOption = this.selectMultipleOption.bind(this);
    this.onChange = this.onChange.bind(this);
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

  componentDidMount() {
    var optionsObj = [
      {
        id: "1",
        name: "Health Check"
      },
      {
        id: "2",
        name: "Automated"
      },
      {
        id: "3",
        name: "API"
      },
      {
        id: "4",
        name: "UI"
      }
    ];
    this.setState({ options: optionsObj });
  }
  onChange(options) {
    this.setState({ values: options });
  }

  render() {
    var bigList = [];
    bigList.push(
      { id: 1, name: "test" },
      { id: 2, name: "test2" },
      { id: 3, name: "test" },
      { id: 4, name: "test2" },
      { id: 5, name: "test" },
      { id: 6, name: "test2" },
      { id: 7, name: "test" },
      { id: 8, name: "test2" }
    );
    return (
      <div className="wrapper">
        <GlobalPanel />
        <ProjectPanel />
        <div className="main-content main-content-grid">
          <Header />
          <div className="main-content--content">
            <div className="main-content--content-header">New Test Case</div>
            <div>
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
              <SearchDropdown
                value={this.state.arrayValue}
                options={bigList}
                onChange={this.selectMultipleOption}
                placeholder={"Test Group"}
                label={"Add to group*"}
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
                <a href="http://google.com">Cancel</a>
              </div>
              <Checkbox label="Add new Test case" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
