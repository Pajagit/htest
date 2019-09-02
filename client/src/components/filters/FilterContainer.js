import React, { Component } from "react";
import SearchDropdown from "../common/SearchDropdown";

class FilterContainer extends Component {
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
      <div className="testcase-grid">
        <SearchDropdown
          value={this.state.arrayValue}
          options={bigList}
          onChange={this.selectMultipleOption}
          label={"Test Groups"}
          placeholder={"Groups"}
        />
        <SearchDropdown
          value={this.state.arrayValue}
          options={bigList}
          onChange={this.selectMultipleOption}
          label={"Select Date"}
          placeholder={"From Date"}
        />
        <SearchDropdown
          value={this.state.arrayValue}
          options={bigList}
          onChange={this.selectMultipleOption}
          label={"Select Date"}
          placeholder={"To Date"}
        />
        <SearchDropdown
          value={this.state.arrayValue}
          options={bigList}
          onChange={this.selectMultipleOption}
          label={"Select User"}
          placeholder={"Users"}
        />
         <SearchDropdown
          value={this.state.arrayValue}
          options={bigList}
          onChange={this.selectMultipleOption}
          label={"Select User"}
          placeholder={"Users"}
        />
      </div>
    );
  }
}
export default FilterContainer;
