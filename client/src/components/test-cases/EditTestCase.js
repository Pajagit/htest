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
import { getGroups } from "../../actions/groupsActions";
import isEmpty from "../../validation/isEmpty";

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
      submitBtnDisabledClass: ""
    };
    this.selectOption = this.selectOption.bind(this);
    this.selectMultipleOption = this.selectMultipleOption.bind(this);
    this.onChange = this.onChange.bind(this);
    this.addColumnStep = this.addColumnStep.bind(this);
    this.removeColumnStep = this.removeColumnStep.bind(this);
    this.addColumnLink = this.addColumnLink.bind(this);
    this.removeColumnLink = this.removeColumnLink.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    var testcaseId = this.props.match.params.testcaseId;
    this.props.getTestcase(testcaseId);
    this.props.getGroups();
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
  submitForm(e) {
    e.preventDefault();
    var formData = {};
    if (
      this.state.titleValidation === "" &&
      this.state.descriptionValidation === "" &&
      this.state.teststepsValidation === "" &&
      this.state.expectedResultValidation === "" &&
      this.state.groupsValidation === "" &&
      this.state.preconditionValidation === "" &&
      this.state.linksValidation === ""
    ) {
      this.setState({ submitBtnDisabledClass: "" });
      var testSteps = this.state.test_steps.map(function(test_step) {
        return test_step["value"];
      });
      var links = this.state.links.map(function(link) {
        return link["value"];
      });

      formData.title = this.state.title;
      formData.description = this.state.description;
      formData.test_steps = testSteps;
      formData.expected_result = this.state.expected_result;
      formData.groups = this.state.selectedGroups;
      formData.preconditions = this.state.preconditions;
      formData.links = links;
      console.log(formData);
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

  onChange(e) {
    if (e.target.name.substring(0, 4) === "link") {
      var linkLimit = 150;

      var links = this.state.links;
      links[e.target.name.substring(5)].value = e.target.value;

      this.setState({ links: links }, () => {
        var filteredLinksLimit = this.state.links.filter(function(link) {
          return link.value !== "" && link.value.length > linkLimit;
        });

        if (filteredLinksLimit.length > 0) {
          var longLinkValue = `"${filteredLinksLimit[0].value.substring(0, 20)}" ...`;
          this.setState({
            linksValidation: `${longLinkValue} link is too long and can have more than ${linkLimit} characters (${filteredLinksLimit[0].value.length})`
          });
        } else {
          this.setState({
            linksValidation: ``
          });
        }
      });
    }
    if (e.target.name.substring(0, 4) === "step") {
      var testStepLimit = 150;

      var testSteps = this.state.test_steps;
      testSteps[e.target.name.substring(5)].value = e.target.value;
      this.setState({ test_steps: testSteps }, () => {
        var filteredTestSteps = this.state.test_steps.filter(function(test_step) {
          return test_step.value !== "";
        });

        var filteredTestStepsLimit = this.state.test_steps.filter(function(test_step) {
          return test_step.value !== "" && test_step.value.length > testStepLimit;
        });
        if (filteredTestSteps.length === 0) {
          this.setState({
            teststepsValidation: `There must be at least one test step`
          });
        } else if (filteredTestStepsLimit.length > 0) {
          var longStepValue = `"${filteredTestStepsLimit[0].value.substring(0, 20)}" ...`;
          this.setState({
            teststepsValidation: `${longStepValue} test step is too long and can have more than ${testStepLimit} characters (${filteredTestStepsLimit[0].value.length})`
          });
        } else {
          this.setState({
            teststepsValidation: ``
          });
        }
      });
    }

    var titleLimit = 150;
    var descriptionLimit = 255;
    var expectedResultLimit = 150;
    var preconditionLimit = 150;

    if (e.target.name === "title" && e.target.value === "") {
      this.setState({ titleValidation: "Title is a required field" });
    } else if (e.target.name === "title" && e.target.value.length > titleLimit) {
      this.setState({
        titleValidation: `Title must have ${titleLimit} characters or less (${e.target.value.length})`
      });
    } else if (e.target.name === "title" && e.target.value !== "" && e.target.value.length <= descriptionLimit) {
      this.setState({ titleValidation: "" });
    }

    if (e.target.name === "description" && e.target.value === "") {
      this.setState({ descriptionValidation: "Description is a required field" });
    } else if (e.target.name === "description" && e.target.value.length > descriptionLimit) {
      this.setState({
        descriptionValidation: `Description must have ${descriptionLimit} characters or less (${e.target.value.length})`
      });
    } else if (e.target.name === "description" && e.target.value !== "" && e.target.value.length <= descriptionLimit) {
      this.setState({ descriptionValidation: "" });
    }

    if (e.target.name === "expected_result" && e.target.value === "") {
      this.setState({ expectedResultValidation: "Expected result is a required field" });
    } else if (e.target.name === "expected_result" && e.target.value.length > expectedResultLimit) {
      this.setState({
        expectedResultValidation: `Expected result must have ${expectedResultLimit} characters or less (${e.target.value.length})`
      });
    } else if (e.target.name === "expected_result" && e.target.value !== "") {
      this.setState({ expectedResultValidation: "" });
    }

    if (e.target.name === "preconditions" && e.target.value.length > preconditionLimit) {
      this.setState({
        preconditionValidation: `Preconditions must have ${preconditionLimit} characters or less (${e.target.value.length})`
      });
    } else if (e.target.name === "preconditions" && e.target.value !== "") {
      this.setState({ preconditionValidation: "" });
    }

    this.setState({ [e.target.name]: e.target.value }, () => {
      if (
        this.state.titleValidation === "" &&
        this.state.descriptionValidation === "" &&
        this.state.teststepsValidation === "" &&
        this.state.expectedResultValidation === "" &&
        this.state.groupsValidation === "" &&
        this.state.preconditionValidation === "" &&
        this.state.linksValidation === ""
      ) {
        this.setState({ submitBtnDisabledClass: "" });
      } else {
        this.setState({ submitBtnDisabledClass: "disabled" });
      }
    });
  }
  onChangeSwitch(e) {
    var newSelectedGroup = this.state.selectedGroups;

    var elementValue = parseInt(e.target.id);

    if (newSelectedGroup.includes(elementValue)) {
      newSelectedGroup = newSelectedGroup.filter(item => item !== elementValue);
      this.setState({ selectedGroups: newSelectedGroup }, () => {
        if (this.state.selectedGroups.length === 0) {
          this.setState({ groupsValidation: "Test case must be assigned to at least one group" });
        } else {
          this.setState({ groupsValidation: "" });
        }
      });
    } else {
      newSelectedGroup.push(elementValue);
      this.setState({ selectedGroups: newSelectedGroup }, () => {
        if (this.state.selectedGroups.length === 0) {
          this.setState({ groupsValidation: "Test case must be assigned to at least one group" });
        } else {
          this.setState({ groupsValidation: "" });
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
      var filteredTestSteps = this.state.test_steps.filter(function(test_step) {
        return test_step.value !== "";
      });

      if (filteredTestSteps.length === 0) {
        this.setState({
          teststepsValidation: `There must be at least one test step`
        });
      } else {
        this.setState({
          teststepsValidation: ``
        });
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
    this.setState({ links });
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
    if (isEmpty(this.props.testcases.testcase)) {
      content = <Spinner />;
    } else {
      content = (
        <div>
          <Input
            type="text"
            placeholder="Enter Test Case Name"
            label="Test case name*"
            validationMsg={this.state.titleValidation}
            value={this.state.title}
            onChange={e => this.onChange(e)}
            name={"title"}
          />
          <Textarea
            placeholder="Enter Test Case Description"
            label="Description*"
            validationMsg={this.state.descriptionValidation}
            value={this.state.description}
            onChange={e => this.onChange(e)}
            name={"description"}
          />
          <InputGroup
            type="text"
            placeholder="Enter Test Steps Here"
            label="Test steps*"
            validationMsg={this.state.teststepsValidation}
            values={this.state.test_steps}
            onChange={e => this.onChange(e)}
            id={"step"}
            addColumn={<FullBtn placeholder="Add test steps" onClick={e => this.addColumnStep(e)} />}
            removeColumn={e => this.removeColumnStep(e)}
            required={true}
          />
          <Input
            type="text"
            placeholder="Enter Result"
            label="Expected Result*"
            validationMsg={this.state.expectedResultValidation}
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
            validationMsg={this.state.groupsValidation}
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
            validationMsg={this.state.preconditionValidation}
            onChange={e => this.onChange(e)}
          />
          <InputGroup
            type="text"
            placeholder="Add Link here"
            label="Links"
            values={this.state.links}
            onChange={e => this.onChange(e)}
            id={"link"}
            validationMsg={this.state.linksValidation}
            addColumn={<FullBtn placeholder="Add links" onClick={e => this.addColumnLink(e)} />}
            removeColumn={e => this.removeColumnLink(e)}
            required={false}
            disabled={false}
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

            <UnderlineAnchor link={`/Testcase/${this.state.testcaseId}`} value={"Cancel"} />
          </div>
          <Checkbox label="Set old test case as deprecated" />
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
            canGoBack={true}
          />
          <div className="main-content--content">{content}</div>
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
  { getTestcase, getGroups }
)(withRouter(EditTestCase));
