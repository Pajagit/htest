import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Btn from "../common/Btn";
import FullBtn from "../common/FullBtn";
import Input from "../common/Input";
import InputGroup from "../common/InputGroup";
// import InputGroupFile from "../common/InputGroupFile";
import Textarea from "../common/Textarea";
import Spinner from "../common/Spinner";
import Switch from "../common/Switch";
import Checkbox from "../common/Checkbox";
import GlobalPanel from "../global-panel/GlobalPanel";
import ProjectPanel from "../project-panel/ProjectPanel";
import Header from "../common/Header";
import UnderlineAnchor from "../common/UnderlineAnchor";
import SearchDropdown from "../common/SearchDropdown";

import { getTestcase } from "../../actions/testcaseActions";
import { editTestcase } from "../../actions/testcaseActions";
import { getGroups } from "../../actions/groupsActions";
import filterStringArray from "../../utility/filterStringArray";
import isEmpty from "../../validation/isEmpty";
import TestCaseValidation from "../../validation/TestCaseValidation";

const bigList = [];

for (var i = 1; i <= 1000; i++) {
  bigList.push({ id: i, name: `Item ${i}` });
}
class EditTestCase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      testcaseId: null,
      projectId: null,
      options: "",
      value: null,
      arrayValue: [],
      title: "",
      description: "",
      expected_result: "",
      preconditions: "",
      test_steps: [],
      links: [],
      groups: [],
      pinnedGroups: [],
      selectedGroups: [],
      uploaded_files: [],
      titleValidation: "",
      descriptionValidation: "",
      teststepsValidation: "",
      expectedResultValidation: "",
      groupsValidation: "",
      preconditionValidation: "",
      linksValidation: "",
      isDeprecated: false,
      submitBtnDisabledClass: "",
      errors: {}
    };
    this.selectOption = this.selectOption.bind(this);
    this.selectMultipleOption = this.selectMultipleOption.bind(this);
    this.onChange = this.onChange.bind(this);
    this.addColumnStep = this.addColumnStep.bind(this);
    this.removeColumnStep = this.removeColumnStep.bind(this);
    this.addColumnLink = this.addColumnLink.bind(this);
    this.removeColumnLink = this.removeColumnLink.bind(this);
    this.toggleDeprecated = this.toggleDeprecated.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    var testcaseId = this.props.match.params.testcaseId;
    this.props.getTestcase(testcaseId);
    this.props.getGroups(1);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    if (nextProps.testcases && nextProps.testcases.testcase) {
      if (nextProps.testcases !== prevState.testcases) {
        var { testcase } = nextProps.testcases;
        if (prevState.initialRender) {
          var selectedGroupIds = testcase.groups.map(function(item) {
            return item["id"];
          });
          update.initialRender = false;
          update.selectedGroups = selectedGroupIds;
          update.description = !isEmpty(testcase.description) ? testcase.description : "";
          update.expected_result = !isEmpty(testcase.expected_result) ? testcase.expected_result : "";
          update.preconditions = !isEmpty(testcase.preconditions) ? testcase.preconditions : "";
          update.title = !isEmpty(testcase.title) ? testcase.title : "";
          update.testcaseId = nextProps.match.params.testcaseId;
          update.links = testcase.links;
          update.projectId = nextProps.match.params.projectId;
        }

        update.test_steps = testcase.test_steps;

        update.uploaded_files = testcase.uploaded_files;
      }
    }

    if (nextProps.groups && nextProps.groups.groups) {
      var { groups } = nextProps.groups;

      var filteredPinnedGroups = groups.filter(function(group) {
        return group.isPinned === true;
      });

      update.pinnedGroups = filteredPinnedGroups;
    }

    return Object.keys(update).length ? update : null;
  }
  submitFormOnEnterKey = e => {
    if (e.keyCode === 13) {
      this.submitForm(e);
    }
  };
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

    const { errors, isValid } = TestCaseValidation(formData);
    if (isValid) {
      this.props.editTestcase(this.state.testcaseId, this.state.projectId, formData, this.props.history);
    } else {
      this.setState({ errors });
    }
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
  toggleDeprecated() {
    this.setState({ isDeprecated: !this.state.isDeprecated });
  }

  onChange(e) {
    if (e.target.id === "link") {
      var enteredLinks = this.state.links;
      enteredLinks[e.target.name.substring(5)].value = e.target.value;
      this.setState({ links: enteredLinks }, () => {
        this.checkValidation();
      });
    }

    if (e.target.id === "step") {
      var enteredTestSteps = this.state.test_steps;
      enteredTestSteps[e.target.name.substring(5)].value = e.target.value;
      this.setState({ test_steps: enteredTestSteps }, () => {
        this.checkValidation();
      });
    }
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.checkValidation();
    });
  }
  onChangeSwitch(e) {
    var newSelectedGroup = this.state.selectedGroups;

    var elementValue = parseInt(e.target.id);

    if (newSelectedGroup.includes(elementValue)) {
      newSelectedGroup = newSelectedGroup.filter(item => item !== elementValue);
      this.setState({ selectedGroups: newSelectedGroup }, () => {
        this.checkValidation();
      });
    } else {
      newSelectedGroup.push(elementValue);
      this.setState({ selectedGroups: newSelectedGroup }, () => {
        this.checkValidation();
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
      this.checkValidation();
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
      this.checkValidation();
    });
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
    var content;
    if (isEmpty(this.props.testcases.testcase) || this.props.testcases.loading) {
      content = <Spinner />;
    } else {
      content = (
        <div className="main-content--content">
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
                label={group.name}
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
          {/* <InputGroupFile
            placeholder="Upload file"
            label="Upload files"
            values={this.state.uploaded_files}
            onChange={e => this.onChangeLink(e)}
            id={"file"}
            addColumn={<FullBtn placeholder="Add File" onClick={e => this.addColumnLink(e)} />}
            removeColumn={e => this.removeColumnLink(e)}
            required={false}
            disabled={true}
          /> */}
          <div className="flex-column-left mt-4">
            <Btn
              className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
              label="Save Changes"
              type="text"
              onClick={e => this.submitForm(e)}
            />

            <UnderlineAnchor link={`/${this.state.projectId}/Testcase/${this.state.testcaseId}`} value={"Cancel"} />
          </div>
          <Checkbox
            label="Set old test case as deprecated"
            onClick={e => this.toggleDeprecated(e)}
            name="isDeprecated"
            value={this.state.isDeprecated}
          />
        </div>
      );
    }
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-arrow-left"></i>}
            title={"Back to Test Case"}
            history={this.props}
            link={`/${this.state.projectId}/TestCase/${this.state.testcaseId}`}
            canGoBack={true}
          />
          {content}
        </div>
      </div>
    );
  }
}

EditTestCase.propTypes = {
  testcases: PropTypes.object.isRequired,
  groups: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases,
  groups: state.groups
  // auth: state.auth,
});

export default connect(
  mapStateToProps,
  { getTestcase, editTestcase, getGroups }
)(withRouter(EditTestCase));
