import React, { Component } from "react";
import Btn from "../components/Btn";
import FullBtn from "../components/FullBtn";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Switch from "../components/Switch";
import Checkbox from "../components/Checkbox";
import SearchDropdown from "../components/SearchDropdown";

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: ""
    };

    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    var optionsObj = [
      {
        value: "1",
        label: "Health Check"
      },
      {
        value: "2",
        label: "Automated"
      },
      {
        value: "3",
        label: "API"
      },
      {
        value: "4",
        label: "UI"
      }
    ];
    this.setState({ options: optionsObj });
  }
  onChange(options) {
    var optionsObj = [
      {
        value: "1",
        label: "Health Check"
      },
      {
        value: "2",
        label: "Automated"
      },
      {
        value: "3",
        label: "API"
      },
      {
        value: "4",
        label: "UI"
      }
    ];
    this.setState({ options: optionsObj });
  }
  render() {
    return (
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
          placeholder={"Test Group"}
          options={this.state.options}
          onChange={values => this.onChange(values)}
          label={"Add to group"}
        />
        <div className="group-grid">
          <Switch label="Health Check" />
          <Switch label="Automated" />
          <Switch label="API" />
          <Switch label="UI" />
        </div>

        <Input type="text" addColumnPlaceholder="Add test steps" placeholder="Enter Condition" label="Precondition" />
        <FullBtn className="full-width-btn" placeholder="Add Links" label="Links" icon="text" />
        <FullBtn className="full-width-btn" placeholder="Add Files" label="Upload Files" icon="text" />
        <div className="flex-column-left mt-4">
          <Btn className="btn btn-primary mr-2" label="Save Test Case" type="text" />
          <Btn className="btn btn-primary mr-2" label="Add To Report" type="text" />
          <a href="#">Cancel</a>
        </div>
        <Checkbox label="Add new Test case" />
      </div>
    );
  }
}
