import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Btn from "../../../components/common/Btn";
import FullBtn from "../../../components/common/FullBtn";
import Input from "../../../components//common/Input";
import InputGroup from "../../../components//common/InputGroup";
import InputGroupDouble from "../../../components//common/InputGroupDouble";
import Textarea from "../../../components//common/Textarea";
import Switch from "../../../components//common/Switch";
import Checkbox from "../../../components//common/Checkbox";
import GlobalPanel from "../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../components/project-panel/ProjectPanel";
import Header from "../../../components//common/Header";
import UnderlineAnchor from "../../../components//common/UnderlineAnchor";
import SearchDropdown from "../../../components//common/SearchDropdown";
import successToast from "../../../toast/successToast";
import failToast from "../../../toast/failToast";

import TestCaseValidation from "../../../validation/TestCaseValidation";
import checkIfElemInObjInArray from "../../../utility/checkIfElemInObjInArray";
import getIdsFromObjArray from "../../../utility/getIdsFromObjArray";
import filterStringArray from "../../../utility/filterStringArray";
import { writePermissions } from "../../../permissions/Permissions";
import { getGroups } from "../../../actions/groupsActions";
import { createTestCase } from "../../../actions/testcaseActions";

class NewTestCase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: null,
      submitPressed: false,
      addNew: false,
      options: "",
      value: null,
      title: "",
      user: this.props.auth.user,
      description: "",
      expected_result: "",
      preconditions: "",
      pinnedGroups: [],
      isValid: false,
      selectedGroups: [],
      test_steps: [{ id: 1, value: "", expected_result: null }],
      notPinnedGroups: [],
      filteredNotPinnedSelectedGroups: [],
      allGroups: [],
      selectedGroupsObjects: [],
      arrayValue: [],
      links: [],
      errors: {}
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};

    if (nextProps.groups && nextProps.groups.groups) {
      var { groups } = nextProps.groups;
      var filteredPinnedGroups = groups.filter(function(group) {
        return group.pinned === true;
      });
      var notPinnedGroups = groups.filter(function(group) {
        return group.pinned === false;
      });
      update.notPinnedGroups = notPinnedGroups;
      update.pinnedGroups = filteredPinnedGroups;
      update.allGroups = groups;
    }

    if (nextProps.auth && nextProps.auth.user) {
      if (nextProps.auth.user !== prevState.user) {
        var { isValid } = writePermissions(nextProps.auth.user.projects, nextProps.match.params.projectId);
        if (!isValid) {
          nextProps.history.push(`/${nextProps.match.params.projectId}/TestCases`);
        }
      }
      update.isValid = isValid;
    }

    return Object.keys(update).length ? update : null;
  }

  componentDidMount() {
    var projectId = this.props.match.params.projectId;
    this.setState({ projectId });
    this.props.getGroups(projectId);
  }
  checkValidation() {
    var formData = {};
    var testSteps = filterStringArray(this.state.test_steps);
    var links = filterStringArray(this.state.links);
    var groups = getIdsFromObjArray(this.state.selectedGroupsObjects);
    formData.title = this.state.title;
    formData.description = this.state.description;
    formData.test_steps = testSteps;
    formData.expected_result = this.state.expected_result;
    formData.groups = groups;
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
    var groups = getIdsFromObjArray(this.state.selectedGroupsObjects);
    formData.title = this.state.title;
    formData.description = this.state.description;
    formData.test_steps = testSteps;
    formData.expected_result = this.state.expected_result;
    formData.groups = groups;
    formData.preconditions = this.state.preconditions;
    formData.isDeprecated = this.state.isDeprecated;
    formData.links = links;
    formData.project_id = this.state.projectId;
    const { errors, isValid } = TestCaseValidation(formData);
    if (isValid) {
      if (this.state.addNew) {
        this.props.createTestCase(formData, res => {
          if (res.status === 200) {
            this.props.history.push(`/${this.state.projectId}/CreateTestCase`);
            successToast("Test case added and you can add new one");
            this.setState({
              title: "",
              description: "",
              test_steps: [{ id: 1, value: "", expected_result: null }],
              expected_result: "",
              selectedGroups: [],
              preconditions: "",
              links: []
            });
          } else {
            failToast("Test case adding failed");
          }
        });
      } else {
        this.props.createTestCase(formData, res => {
          if (res.status === 200) {
            this.props.history.push(`/${this.state.projectId}/TestCase/${res.data.id}`);
            successToast("Test case added successfully");
          } else {
            failToast("Test case adding failed");
          }
        });
      }
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
    } else if (e.target.id === "expe") {
      var enteredExpectedResult = this.state.test_steps;
      enteredExpectedResult[e.target.name.substring(5)].value = e.target.value;
      this.setState({ test_steps: enteredExpectedResult }, () => {
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
    var newArray = this.state.selectedGroupsObjects;
    if (checkIfElemInObjInArray(newArray, parseInt(e.target.id))) {
      for (var i = 0; i < newArray.length; i++) {
        if (newArray[i].id === parseInt(e.target.id)) {
          newArray.splice(i, 1);
          break;
        }
      }
    } else {
      var newObject = this.state.allGroups.filter(item => {
        return item.id === parseInt(e.target.id);
      });
      newArray.push(newObject[0]);
    }

    this.setState({ selectedGroupsObjects: newArray }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }

  selectMultipleOptionGroups(e) {
    var filteredUnpinnedGroups = this.state.selectedGroupsObjects.filter(function(group) {
      return group.pinned !== false;
    });

    function merge(a, b, prop) {
      var reduced = a.filter(aitem => !b.find(bitem => aitem[prop] === bitem[prop]));
      return reduced.concat(b);
    }

    var allSelectedGroups = merge(filteredUnpinnedGroups, e, "id");

    this.setState({ filteredNotPinnedSelectedGroups: e, selectedGroupsObjects: allSelectedGroups }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }
  toggleNew() {
    this.setState({ addNew: !this.state.addNew });
  }

  addColumnStep(e) {
    var test_steps = this.state.test_steps;
    test_steps.push({ id: test_steps.length, value: "", expected_result: null });
    this.setState({ test_steps }, () => {
      console.log(this.state.test_steps);
    });
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

  render() {
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
              {/* <InputGroup
                type='text'
                placeholder='Enter Test Steps Here'
                label='Test steps*'
                validationMsg={this.state.errors.test_steps}
                values={this.state.test_steps}
                onChange={e => this.onChange(e)}
                id={"step"}
                addColumn={<FullBtn placeholder='Add test steps' onClick={e => this.addColumnStep(e)} />}
                removeColumn={e => this.removeColumnStep(e)}
                required={true}
                onKeyDown={this.submitFormOnEnterKey}
              /> */}
              <InputGroupDouble
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
                value={this.state.filteredNotPinnedSelectedGroups}
                options={this.state.notPinnedGroups}
                onChange={e => this.selectMultipleOptionGroups(e)}
                placeholder={"Test Group"}
                label={"Add to group*"}
                validationMsg={this.state.errors.groups}
                multiple={true}
              />
              <div className="group-grid">
                {this.state.pinnedGroups.map((group, index) => (
                  <Switch
                    key={index}
                    label={group.title}
                    value={this.state.selectedGroups.includes(group.id)}
                    id={group.id}
                    onClick={e => this.onChangeSwitch(e)}
                    name={group.title}
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
                  className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2 mb-1`}
                  label="Save Test Case"
                  type="text"
                  onClick={e => this.submitForm(e)}
                />
                <Btn className="btn btn-primary mr-2 mb-1" label="Add To Report" type="text" />
                <UnderlineAnchor link={"TestCases"} value={"Cancel"} />
              </div>
              <Checkbox
                label="Add New Test Case"
                onClick={e => this.toggleNew(e)}
                name="addNew"
                value={this.state.addNew}
              />
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
  groups: state.groups,
  auth: state.auth
});

export default connect(mapStateToProps, { createTestCase, getGroups })(withRouter(NewTestCase));
