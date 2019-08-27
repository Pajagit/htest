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
        <h1>Primary button</h1>
        <br />
        <Btn className="btn btn-primary" label="Save Test Case" type="text" />
        <br />
        <Btn className="btn btn-primary" label="Add To Report" type="text" />
        <br />
        <hr />
        <h1>Input field</h1>
        <br />
        <Input type="text" placeholder="Enter Test Case Name" label="Test case name*" validationMsg="validation msg" />
        <br />
        <hr />
        <h1>Text area</h1>
        <br />
        <Textarea placeholder="Enter Test Case Description" label="Description*" validationMsg="validation msg" />
        <br />
        <hr />
        <h1>Full width button</h1>
        <br />
        <FullBtn className="full-width-btn" label="Links" placeholder="Add links" icon="text" />
        <br />
        <hr />
        <h1>Switch</h1>
        <br />
        <Switch label="Add test steps for this test case here" />
        <br />
        <hr />
        <h1>Checkbox</h1>
        <br />
        <Checkbox label="Add new Test case" />
        <br />
        <hr />
        <h1>Select dropdown</h1>
        <br />

        <SearchDropdown
          placeholder={"Test Group"}
          options={this.state.options}
          onChange={values => this.onChange(values)}
          label={"Add to group"}
        />
        <br />
        <hr />
      </div>
    );
  }
}
