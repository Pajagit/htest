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

import { getTestcase } from "../../actions/testcaseActions";

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
      title: "",
      description: "",
      expected_result: "",
      precondition: "",
      test_steps: [],
      links: [],
      groups: []
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
    this.props.getTestcase();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.testcases && nextProps.testcases.testcase) {
      var { testcase } = nextProps.testcases;

      if (nextProps.testcases !== prevState.testcases) {
        return {
          title: testcase.title,
          description: testcase.description,
          expected_result: testcase.expected_result,
          precondition: testcase.preconditions,
          test_steps: testcase.test_steps,
          links: testcase.links
        };
      }
    }
    return null;
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
    this.setState({ test_steps: testSteps }, () => {
      console.log(this.state);
    });
  };
  onChangeSwitch(e, value) {
    this.setState({ [e.target.name]: value }, () => {
      console.log(this.state);
    });
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
                <Switch
                  label="Health Check"
                  value={this.state.healthCheck}
                  onChange={e => this.onChangeSwitch(e, !this.state.healthCheck)}
                  name={"healthCheck"}
                />
                <Switch label="Automated" checked={true} onChange={e => this.onChangeSwitch(e)} name={"automated"} />
                <Switch label="API" checked={false} onChange={e => this.onChangeSwitch(e)} name={"api"} />
                <Switch label="UI" checked={true} onChange={e => this.onChangeSwitch(e)} name={"ui"} />
              </div>

              <Input
                type="text"
                addColumnPlaceholder="Add test steps"
                placeholder="Enter Condition"
                label="Precondition"
                value={this.state.precondition}
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
              />
              <FullBtn className="full-width-btn" placeholder="Upload File" label="Upload Files" icon="text" />
              <div className="flex-column-left mt-4">
                <Btn className="btn btn-primary mr-2" label="Save Changes" type="text" />

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

EditTestCase.propTypes = {
  testcases: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases
  // auth: state.auth,
});

export default connect(
  mapStateToProps,
  { getTestcase }
)(withRouter(EditTestCase));
