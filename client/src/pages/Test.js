import React, { Component } from "react";
import Btn from "../components/Btn";
import FullBtn from "../components/FullBtn";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Switch from "../components/Switch";

export default class Test extends Component {
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
        <FullBtn className="full-width-btn" label="Add test steps for this test case here" icon="text" />
        <br />
        <hr />
        <h1>Switch</h1>
        <br />
        <Switch label="Add test steps for this test case here" />
      </div>
    );
  }
}
