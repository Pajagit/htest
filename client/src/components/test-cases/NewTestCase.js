import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Btn from "../common/Btn";
import FullBtn from "../common/FullBtn";
import Input from "../common/Input";
import InputGroup from "../common/InputGroup";
import Textarea from "../common/Textarea";
import Switch from "../common/Switch";
import Checkbox from "../common/Checkbox";
import GlobalPanel from "../global-panel/GlobalPanel";
import ProjectPanel from "../project-panel/ProjectPanel";
import Header from "../common/Header";
import UnderlineAnchor from "../common/UnderlineAnchor";
import SearchDropdown from "../common/SearchDropdown";

import TestCaseValidation from "../../validation/TestCaseValidation";
import filterStringArray from "../../utility/filterStringArray";
import { getGroups } from "../../actions/groupsActions";
import { createTestCase } from "../../actions/testcaseActions";

const bigList = [];

for (var i = 1; i <= 1000; i++) {
  bigList.push({ id: i, name: `Item ${i}` });
}
class NewTestCase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: null,
      submitPressed: false,
      options: "",
      value: null,
      title: "",
      description: "",
      expected_result: "",
      preconditions: "",
      pinnedGroups: [],
      selectedGroups: [],
      test_steps: [{ id: 1, value: "" }],
      arrayValue: [],
      links: [],
      errors: {}
    };
    this.selectOption = this.selectOption.bind(this);
    this.selectMultipleOption = this.selectMultipleOption.bind(this);
  }
  componentDidMount() {
    var projectId = this.props.match.params.projectId;
    this.setState({ projectId });
    this.props.getGroups();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};

    if (nextProps.groups && nextProps.groups.groups) {
      var { groups } = nextProps.groups;

      var filteredPinnedGroups = groups.filter(function(group) {
        return group.isPinned === true;
      });

      update.pinnedGroups = filteredPinnedGroups;
    }

    return Object.keys(update).length ? update : null;
  }
  checkValidation() {
    var formData = {};
    var testSteps = filterStringArray(this.state.test_steps);
    var links = filterStringArray(this.state.links);
    formData.title = this.state.title;
    formData.description = this.state.description;
    formData.test_steps = testSteps;
    formData.expected_result = this.state.expected_result;
    formData.groups = this.state.selectedGroups;
    formData.preconditions = this.state.preconditions;
    formData.isDeprecated = this.state.isDeprecated;
    formData.links = links;

    const { errors } = TestCaseValidation(formData);

    this.setState({ errors });
  }
  submitForm(e) {
    this.setState({ submitPressed: true });
    e.preventDefault();
    var formData = {};

    var testSteps = filterStringArray(this.state.test_steps);
    var links = filterStringArray(this.state.links);
    formData.title = this.state.title;
    formData.description = this.state.description;
    formData.test_steps = testSteps;
    formData.expected_result = this.state.expected_result;
    formData.groups = this.state.selectedGroups;
    formData.preconditions = this.state.preconditions;
    formData.isDeprecated = this.state.isDeprecated;
    formData.links = links;
    formData.project_id = this.state.projectId;
    const { errors, isValid } = TestCaseValidation(formData);
    if (isValid) {
      this.props.createTestCase(formData, this.props.history);
    } else {
      this.setState({ errors });
    }
  }

  onChange(e) {
    if (e.target.id === "link") {
      var enteredLinks = this.state.links;
      enteredLinks[e.target.name.substring(5)].value = e.target.value;
      this.setState({ links: enteredLinks }, () => {
        if (this.state.submitPressed) {
          this.checkValidation();
        }
      });
    } else if (e.target.id === "step") {
      var enteredTestSteps = this.state.test_steps;
      enteredTestSteps[e.target.name.substring(5)].value = e.target.value;
      this.setState({ test_steps: enteredTestSteps }, () => {
        if (this.state.submitPressed) {
          this.checkValidation();
        }
      });
    } else {
      this.setState({ [e.target.name]: e.target.value }, () => {
        if (this.state.submitPressed) {
          this.checkValidation();
        }
      });
    }
  }

  onChangeSwitch(e) {
    var newSelectedGroup = this.state.selectedGroups;

    var elementValue = parseInt(e.target.id);

    if (newSelectedGroup.includes(elementValue)) {
      newSelectedGroup = newSelectedGroup.filter(item => item !== elementValue);
      this.setState({ selectedGroups: newSelectedGroup }, () => {
        if (this.state.submitPressed) {
          this.checkValidation();
        }
      });
    } else {
      newSelectedGroup.push(elementValue);
      this.setState({ selectedGroups: newSelectedGroup }, () => {
        if (this.state.submitPressed) {
          this.checkValidation();
        }
      });
    }
  }

  addColumnStep(e) {
    var test_steps = this.state.test_steps;
    test_steps.push({ id: test_steps.length, value: "" });
    this.setState({ test_steps });
  }
  removeColumnStep(e) {
    var indexToRemove = e.target.id.substring(5);
    var test_steps = this.state.test_steps;
    test_steps.splice(indexToRemove, 1);
    this.setState({ test_steps }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }
  addColumnLink(e) {
    var links = this.state.links;
    links.push({ id: links.length, value: "" });
    this.setState({ links });
  }
  removeColumnLink(e) {
    var indexToRemove = e.target.id.substring(5);
    var links = this.state.links;
    links.splice(indexToRemove, 1);
    this.setState({ links }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
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
            title={"Back to All Test Cases"}
            link={`/${this.state.projectId}/TestCases`}
            canGoBack={true}
          />
          <div className="main-content--content">
            <div>
              <Input
                type="text"
                placeholder="Enter Test Case Name"
                label="Test case name*"
                validationMsg={this.state.errors.title}
                value={this.state.title}
                onChange={e => this.onChange(e)}
                name={"title"}
                onKeyDown={this.submitFormOnEnterKey}
              />
              <Textarea
                placeholder="Enter Test Case Description"
                label="Description*"
                validationMsg={this.state.errors.description}
                value={this.state.description}
                onChange={e => this.onChange(e)}
                name={"description"}
                onKeyDown={this.submitFormOnEnterKey}
              />
              <InputGroup
                type="text"
                placeholder="Enter Test Steps Here"
                label="Test steps*"
                validationMsg={this.state.errors.test_steps}
                values={this.state.test_steps}
                onChange={e => this.onChange(e)}
                id={"step"}
                addColumn={<FullBtn placeholder="Add test steps" onClick={e => this.addColumnStep(e)} />}
                removeColumn={e => this.removeColumnStep(e)}
                required={true}
                onKeyDown={this.submitFormOnEnterKey}
              />
              <Input
                type="text"
                placeholder="Enter Result"
                label="Expected Result*"
                validationMsg={this.state.errors.expected_result}
                value={this.state.expected_result}
                onChange={e => this.onChange(e)}
                name={"expected_result"}
                onKeyDown={this.submitFormOnEnterKey}
              />
              <SearchDropdown
                value={this.state.arrayValue}
                options={bigList}
                onChange={this.selectMultipleOption}
                placeholder={"Test Group"}
                label={"Add to group*"}
                validationMsg={this.state.errors.groups}
              />
              <div className="group-grid">
                {this.state.pinnedGroups.map((group, index) => (
                  <Switch
                    key={index}
                    label={group.value}
                    value={this.state.selectedGroups.includes(group.id)}
                    id={group.id}
                    onClick={e => this.onChangeSwitch(e)}
                    name={group.name}
                  />
                ))}
              </div>

              <Input
                type="text"
                addColumnPlaceholder="Add test steps"
                placeholder="Enter Condition"
                label="Precondition"
                name={"preconditions"}
                value={this.state.preconditions}
                validationMsg={this.state.errors.preconditions}
                onChange={e => this.onChange(e)}
                onKeyDown={this.submitFormOnEnterKey}
              />
              <InputGroup
                type="text"
                placeholder="Add Link here"
                label="Links"
                values={this.state.links}
                onChange={e => this.onChange(e)}
                id={"link"}
                validationMsg={this.state.errors.links}
                addColumn={<FullBtn placeholder="Add links" onClick={e => this.addColumnLink(e)} />}
                removeColumn={e => this.removeColumnLink(e)}
                required={false}
                disabled={false}
                onKeyDown={this.submitFormOnEnterKey}
              />

              <div className="flex-column-left mt-4">
                <Btn
                  className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
                  label="Save Test Case"
                  type="text"
                  onClick={e => this.submitForm(e)}
                />
                <Btn className="btn btn-primary mr-2" label="Add To Report" type="text" />
                <UnderlineAnchor link={"TestCases"} value={"Cancel"} />
              </div>
              <Checkbox label="Add new Test case" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NewTestCase.propTypes = {
  groups: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  groups: state.groups
  // auth: state.auth,
});

export default connect(
  mapStateToProps,
  { createTestCase, getGroups }
)(withRouter(NewTestCase));
