import React, { useState, useEffect } from "react";
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

function EditTestCase(props) {
  const [project, setProject] = useState([]);
  const [testcase, setTestcase] = useState([]);
  const [errors, setErrors] = useState([]);
  const [pinnedGroups, setPinnedGroups] = useState([]);
  const [newGroups, setNewGroups] = useState([]);

  var { getTestcase } = props;
  var { getGroups } = props;
  var { testcaseId } = props.match.params;

  useEffect(() => {
    getTestcase(testcaseId, res => {
      setTestcase(res.payload);

      var selectedGroupIds = res.payload.groups.map(function(item) {
        return item["id"];
      });
      setNewGroups(selectedGroupIds);
    });
    getGroups(res => {
      if (res.payload) {
        var groups = res.payload;

        var filteredPinnedGroups = groups.filter(function(group) {
          return group.isPinned === true;
        });
        setPinnedGroups(filteredPinnedGroups);
      }
    });

    setProject({
      title: "HUMEDS",
      projectId: 1
    });
  }, [getGroups, getTestcase, testcaseId]);

  useEffect(() => {
    console.log(newGroups);
    var checkValidation = () => {
      var formData = {};
      var testSteps = filterStringArray(testcase.test_steps);
      var links = filterStringArray(testcase.links);
      formData.title = testcase.title;
      formData.description = testcase.description;
      formData.test_steps = testSteps;
      formData.expected_result = testcase.expected_result;
      formData.groups = newGroups;
      formData.preconditions = testcase.preconditions;
      formData.isDeprecated = testcase.isDeprecated;
      formData.links = links;

      const { errors } = TestCaseValidation(formData);
      // console.log(formData);
      setErrors(errors);
    };
    // console.log(testcase);
    if (!isEmpty(testcase)) {
      checkValidation();
    }
  }, [testcase, newGroups]);

  var onChangeSwitch = e => {
    var newSelectedGroup = newGroups;
    console.log(newGroups);
    var elementValue = parseInt(e.target.id);

    if (newSelectedGroup.includes(elementValue)) {
      newSelectedGroup = newSelectedGroup.filter(item => item !== elementValue);
      setNewGroups(newSelectedGroup);
    } else {
      newSelectedGroup.push(elementValue);
      setNewGroups(newSelectedGroup);
    }
  };

  var submitFormOnEnterKey = e => {
    if (e.keyCode === 13) {
      submitForm(e);
    }
  };

  var submitForm = e => {
    e.preventDefault();
    var formData = {};

    var testSteps = filterStringArray(testcase.test_steps);
    var links = filterStringArray(testcase.links);
    formData.title = testcase.title;
    formData.description = testcase.description;
    formData.test_steps = testSteps;
    formData.expected_result = testcase.expected_result;
    formData.groups = newGroups;
    formData.preconditions = testcase.preconditions;
    formData.isDeprecated = testcase.isDeprecated;
    formData.links = links;

    const { errors, isValid } = TestCaseValidation(formData);
    if (isValid) {
      props.editTestcase(testcase.id, project.projectId, formData, props.history);
    } else {
      setErrors(errors);
    }
  };

  var selectMultipleOption = value => {
    console.count("onChange");
    console.log("Val", value);
    this.setState({ arrayValue: value });
  };
  var toggleDeprecated = () => {
    this.setState({ isDeprecated: !testcase.isDeprecated });
  };

  var onChange = e => {
    if (e.target.id === "link") {
      var enteredLinks = testcase.links;
      enteredLinks[e.target.name.substring(5)].value = e.target.value;
      this.setState({ links: enteredLinks });
    }

    if (e.target.id === "step") {
      var enteredTestSteps = testcase.test_steps;
      enteredTestSteps[e.target.name.substring(5)].value = e.target.value;
      this.setState({ test_steps: enteredTestSteps });
    }
    setTestcase({ ...testcase, [e.target.name]: e.target.value });
  };

  var addColumnStep = e => {
    var test_steps = testcase.test_steps;
    test_steps.push({ id: test_steps.length, value: "" });
    this.setState({ test_steps });
  };
  var removeColumnStep = e => {
    var indexToRemove = e.target.id.substring(5);
    var test_steps = this.state.test_steps;
    test_steps.splice(indexToRemove, 1);
    this.setState({ test_steps });
  };
  var addColumnLink = e => {
    var links = this.state.links;
    links.push({ id: links.length, value: "" });
    this.setState({ links });
  };
  var removeColumnLink = e => {
    var indexToRemove = e.target.id.substring(5);
    var links = this.state.links;
    links.splice(indexToRemove, 1);
    this.setState({ links });
  };

  // render() {
  var bigList = [];
  bigList.push(
    { id: 1, name: "Health Check" },
    { id: 2, name: "Automation" },
    { id: 3, name: "Regression" },
    { id: 4, name: "API" },
    { id: 5, name: "UI" }
  );
  var content;
  if (
    // isEmpty(props.testcases.testcase) || props.testcases.loading || props.testcases.testcase.test_steps
    isEmpty(testcase.test_steps)
  ) {
    content = <Spinner />;
  } else {
    content = (
      <div className="main-content--content">
        <Input
          type="text"
          placeholder="Enter Test Case Name"
          label="Test case name*"
          validationMsg={errors.title}
          value={testcase.title}
          onChange={e => onChange(e)}
          name={"title"}
          onKeyDown={submitFormOnEnterKey}
        />
        <Textarea
          placeholder="Enter Test Case Description"
          label="Description*"
          validationMsg={errors.description}
          value={testcase.description}
          onChange={e => onChange(e)}
          name={"description"}
          onKeyDown={submitFormOnEnterKey}
        />
        <InputGroup
          type="text"
          placeholder="Enter Test Steps Here"
          label="Test steps*"
          validationMsg={errors.test_steps}
          values={testcase.test_steps}
          onChange={e => onChange(e)}
          id={"step"}
          addColumn={<FullBtn placeholder="Add test steps" onClick={e => addColumnStep(e)} />}
          removeColumn={e => removeColumnStep(e)}
          required={true}
          onKeyDown={submitFormOnEnterKey}
        />
        <Input
          type="text"
          placeholder="Enter Result"
          label="Expected Result*"
          validationMsg={errors.expected_result}
          value={testcase.expected_result}
          onChange={e => onChange(e)}
          name={"expected_result"}
          onKeyDown={submitFormOnEnterKey}
        />
        <SearchDropdown
          value={[]}
          options={bigList}
          onChange={selectMultipleOption}
          placeholder={"Test Group"}
          label={"Add to group*"}
          validationMsg={errors.groups}
        />
        <div className="group-grid">
          {pinnedGroups.map((group, index) => (
            <Switch
              key={index}
              label={group.value}
              value={newGroups.includes(group.id)}
              id={group.id}
              onClick={e => onChangeSwitch(e)}
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
          value={testcase.preconditions}
          validationMsg={errors.preconditions}
          onChange={e => this.onChange(e)}
          onKeyDown={submitFormOnEnterKey}
        />
        <InputGroup
          type="text"
          placeholder="Add Link here"
          label="Links"
          values={testcase.links}
          onChange={e => this.onChange(e)}
          id={"link"}
          validationMsg={errors.links}
          addColumn={<FullBtn placeholder="Add links" onClick={e => addColumnLink(e)} />}
          removeColumn={e => removeColumnLink(e)}
          required={false}
          disabled={false}
          onKeyDown={submitFormOnEnterKey}
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
          <Btn className={`btn btn-primary  mr-2`} label="Save Changes" type="text" onClick={e => submitForm(e)} />

          <UnderlineAnchor link={`/${testcase.projectId}/Testcase/${testcase.testcaseId}`} value={"Cancel"} />
        </div>
        <Checkbox
          label="Set old test case as deprecated"
          onClick={e => toggleDeprecated(e)}
          name="isDeprecated"
          value={false}
        />
      </div>
    );
  }
  return (
    <div className="wrapper">
      <GlobalPanel props={props} />
      <ProjectPanel projectId={props.match.params.projectId} />
      <div className="main-content main-content-grid">
        <Header
          icon={<i className="fas fa-arrow-left"></i>}
          title={"Back to Test Case"}
          history={props}
          link={`/${project.projectId}/TestCase/${testcase.id}`}
          canGoBack={true}
        />
        {content}
      </div>
    </div>
  );
  // }
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
