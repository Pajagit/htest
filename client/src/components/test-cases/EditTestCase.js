import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Btn from "../common/Btn";
import FullBtn from "../common/FullBtn";
import Input from "../common/Input";
import InputGroup from "../common/InputGroup";
import InputGroupFile from "../common/InputGroupFile";
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
      uploaded_files: []
    };
    this.selectOption = this.selectOption.bind(this);
    this.selectMultipleOption = this.selectMultipleOption.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeStep = this.onChangeStep.bind(this);
    this.addColumnStep = this.addColumnStep.bind(this);
    this.removeColumnStep = this.removeColumnStep.bind(this);
    this.addColumnLink = this.addColumnLink.bind(this);
    this.removeColumnLink = this.removeColumnLink.bind(this);
    this.onChangeLink = this.onChangeLink.bind(this);
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
        }

        update.test_steps = testcase.test_steps;
        update.links = testcase.links;
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
  onChangeStep = e => {
    var testSteps = this.state.test_steps;
    testSteps[e.target.name.substring(5)].value = e.target.value;
    this.setState({ test_steps: testSteps }, () => {});
  };
  onChangeSwitch(e) {
    var newSelectedGroup = this.state.selectedGroups;

    var elementValue = parseInt(e.target.id);

    if (newSelectedGroup.includes(elementValue)) {
      newSelectedGroup = newSelectedGroup.filter(item => item !== elementValue);
      // newSelectedGroup = [343];
      // console.log(newSelectedGroup);
      this.setState({ selectedGroups: newSelectedGroup }, () => {
        console.log(this.state.selectedGroups);
      });
    } else {
      newSelectedGroup.push(elementValue);
      this.setState({ selectedGroups: newSelectedGroup }, () => {
        console.log(this.state.selectedGroups);
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
    this.setState({ test_steps });
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
  onChangeLink = e => {
    var links = this.state.links;
    links[e.target.name.substring(5)].value = e.target.value;
    this.setState({ links: links }, () => {
      console.log(this.state);
    });
  };

  render() {
    var bigList = [];
    bigList.push(
      { id: 1, name: "Health Check" },
      { id: 2, name: "Automation" },
      { id: 3, name: "Regression" },
      { id: 4, name: "API" },
      { id: 5, name: "UI" }
    );
    // console.log(this.state.selectedGroups);
    var content;
    if (isEmpty(this.state.title)) {
      content = <Spinner />;
    } else {
      content = (
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
          <InputGroup
            type="text"
            placeholder="Enter Test Steps Here"
            label="Test steps*"
            // validationMsg="At least one test step is required"
            values={this.state.test_steps}
            onChange={e => this.onChangeStep(e)}
            id={"step"}
            addColumn={<FullBtn placeholder="Add test steps" onClick={e => this.addColumnStep(e)} />}
            removeColumn={e => this.removeColumnStep(e)}
            required={true}
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
            onChange={e => this.onChange(e)}
          />
          <InputGroup
            type="text"
            placeholder="Add Link here"
            label="Links"
            values={this.state.links}
            onChange={e => this.onChangeLink(e)}
            id={"link"}
            addColumn={<FullBtn placeholder="Add links" onClick={e => this.addColumnLink(e)} />}
            removeColumn={e => this.removeColumnLink(e)}
            required={false}
            disabled={false}
          />
          <InputGroupFile
            placeholder="Upload file"
            label="Upload files"
            values={this.state.uploaded_files}
            onChange={e => this.onChangeLink(e)}
            id={"file"}
            addColumn={<FullBtn placeholder="Add File" onClick={e => this.addColumnLink(e)} />}
            removeColumn={e => this.removeColumnLink(e)}
            required={false}
            disabled={true}
          />
          <div className="flex-column-left mt-4">
            <Btn className="btn btn-primary mr-2" label="Save Changes" type="text" />

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
