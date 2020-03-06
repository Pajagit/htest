import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Btn from "../../../components/common/Btn";
import FullBtn from "../../../components/common/FullBtn";
import Input from "../../../components/common/Input";
import InputGroup from "../../../components/common/InputGroup";
import InputGroupDouble from "../../../components/common/InputGroupDouble";
import Textarea from "../../../components/common/Textarea";
import Spinner from "../../../components/common/Spinner";
import Switch from "../../../components/common/Switch";
import Checkbox from "../../../components/common/Checkbox";
import GlobalPanel from "../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../components/project-panel/ProjectPanel";
import Header from "../../../components/common/Header";
import Confirm from "../../../components/common/Confirm";
import UnderlineAnchor from "../../../components/common/UnderlineAnchor";
import SearchDropdown from "../../../components/common/SearchDropdown";
import successToast from "../../../toast/successToast";
import failToast from "../../../toast/failToast";

import { getTestcase } from "../../../actions/testcaseActions";
import { setTestcaseDeprecated } from "../../../actions/testcaseActions";

import { editTestcase } from "../../../actions/testcaseActions";
import { getGroups } from "../../../actions/groupsActions";
import filterStringArray from "../../../utility/filterStringArray";
import isEmpty from "../../../validation/isEmpty";
import TestCaseValidation from "../../../validation/TestCaseValidation";
import { writePermissions } from "../../../permissions/Permissions";
import checkIfElemInObjInArray from "../../../utility/checkIfElemInObjInArray";
import getIdsFromObjArray from "../../../utility/getIdsFromObjArray";

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
      user: this.props.auth.user,
      title: "",
      description: "",
      expected_result: "",
      preconditions: "",
      test_steps: [],
      links: [],
      groups: [],
      pinnedGroups: [],
      notPinnedGroups: [],
      selectedGroups: [],
      selectedGroupsObjects: [],
      filteredNotPinnedSelectedGroups: [],
      uploaded_files: [],
      groupFilters: [],
      titleValidation: "",
      descriptionValidation: "",
      teststepsValidation: "",
      expectedResultValidation: "",
      groupsValidation: "",
      preconditionValidation: "",
      linksValidation: "",
      deprecated: false,
      isValidWrite: false,
      submitBtnDisabledClass: "",
      errors: {}
    };
    this.selectOption = this.selectOption.bind(this);
    this.selectMultipleOptionGroups = this.selectMultipleOptionGroups.bind(this);
    this.onChange = this.onChange.bind(this);
    this.addColumnStep = this.addColumnStep.bind(this);
    this.removeColumnStep = this.removeColumnStep.bind(this);
    this.addColumnLink = this.addColumnLink.bind(this);
    this.removeColumnLink = this.removeColumnLink.bind(this);
    this.toggleDeprecated = this.toggleDeprecated.bind(this);
    this.selectMultipleOptionGroups = this.selectMultipleOptionGroups.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    var testcaseId = this.props.match.params.testcaseId;
    var projectId = this.props.match.params.projectId;
    this.props.getTestcase(testcaseId);
    this.props.getGroups(projectId);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    if (nextProps.testcases && nextProps.testcases.testcase) {
      if (prevState.initialRender) {
        if (nextProps.testcases !== prevState.testcases) {
          var { testcase } = nextProps.testcases;

          var selectedGroupIds = testcase.groups.map(function(item) {
            return item["id"];
          });
          update.initialRender = false;
          update.selectedGroups = selectedGroupIds;
          update.selectedGroupsObjects = testcase.groups;
          update.description = !isEmpty(testcase.description) ? testcase.description : "";
          update.expected_result = !isEmpty(testcase.expected_result) ? testcase.expected_result : "";
          update.preconditions = !isEmpty(testcase.preconditions) ? testcase.preconditions : "";
          update.title = !isEmpty(testcase.title) ? testcase.title : "";
          update.testcaseId = nextProps.match.params.testcaseId;
          update.links = testcase.links;
          update.projectId = nextProps.match.params.projectId;

          var filteredNotPinnedSelectedGroups = testcase.groups.filter(function(group) {
            return group.pinned === false;
          });
          update.filteredNotPinnedSelectedGroups = filteredNotPinnedSelectedGroups;
        }

        update.test_steps = testcase.test_steps;

        update.uploaded_files = testcase.uploaded_files;
      }
      if (nextProps.groups && nextProps.groups.groups) {
        var { groups } = nextProps.groups;

        var filteredPinnedGroups = groups.filter(function(group) {
          return group.pinned === true;
        });

        update.pinnedGroups = filteredPinnedGroups;

        var filteredUnpinnedGroups = groups.filter(function(group) {
          return group.pinned === false;
        });

        update.notPinnedGroups = filteredUnpinnedGroups;
        update.allGroups = groups;
      }
      if (nextProps.auth && nextProps.auth.user) {
        if (nextProps.auth.user !== prevState.user) {
          var { isValid } = writePermissions(nextProps.auth.user.projects, nextProps.match.params.projectId);
          if (!isValid) {
            nextProps.history.push(
              `/${nextProps.match.params.projectId}/TestCase/${nextProps.match.params.testcaseId}`
            );
          }
        }
        update.isValid = isValid;
      }
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
    var groups = getIdsFromObjArray(this.state.selectedGroupsObjects);
    formData.title = this.state.title;
    formData.description = this.state.description;
    formData.test_steps = testSteps;
    formData.expected_result = this.state.expected_result;
    formData.groups = groups;
    formData.preconditions = this.state.preconditions;
    formData.deprecated = this.state.deprecated;
    formData.links = links;

    const { errors } = TestCaseValidation(formData);

    this.setState({ errors });
  }
  submitForm(e) {
    e.preventDefault();
    var formData = {};

    var testSteps = filterStringArray(this.state.test_steps);
    var links = filterStringArray(this.state.links);
    var groups = getIdsFromObjArray(this.state.selectedGroupsObjects);
    formData.project_id = this.state.projectId;
    formData.title = this.state.title;
    formData.description = this.state.description;
    formData.test_steps = this.state.test_steps;
    formData.expected_result = this.state.expected_result;
    formData.groups = groups;
    formData.preconditions = this.state.preconditions;
    formData.deprecated = this.state.deprecated;
    formData.links = links;
    const { errors, isValid } = TestCaseValidation(formData);
    if (isValid) {
      this.props.editTestcase(this.state.testcaseId, formData, res => {
        if (res.status === 200 && !formData.deprecated) {
          successToast("Test case edited successfully");
          this.props.history.push(`/${this.state.projectId}/TestCase/${res.data.id}`);
        } else if (res.status === 200 && formData.deprecated) {
          successToast("New Test Case version created");
          this.props.history.push(`/${this.state.projectId}/TestCase/${res.data.id}`);
        } else {
          failToast("Test case edit failed");
          this.props.history.push(`/${this.state.projectId}/TestCase/${this.state.testcaseId}`);
        }
      });
    } else {
      this.setState({ errors });
    }
  }
  selectOption(value) {
    this.setState({ value });
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
      this.checkValidation();
    });
  }

  toggleDeprecated() {
    this.setState({ deprecated: !this.state.deprecated });
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
    } else if (e.target.id === "expe") {
      var enteredExpectedResult = this.state.test_steps;
      enteredExpectedResult[e.target.name.substring(5)].expected_result = e.target.value;
      this.setState({ test_steps: enteredExpectedResult }, () => {
        if (this.state.submitPressed) {
          this.checkValidation();
        }
      });
    }
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.checkValidation();
    });
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
      this.checkValidation();
    });
  }
  addColumnStep(e) {
    var test_steps = this.state.test_steps;
    test_steps.push({ id: test_steps.length, value: "", expected_result: "" });
    this.setState({ test_steps });
  }
  removeColumnStep(e) {
    var indexToRemove = e.target.id.substring(10);
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
  confirmDeprecate = () => {
    this.props.setTestcaseDeprecated(this.state.testcaseId, res => {
      if (res.status === 200) {
        this.props.history.push(`/${this.state.projectId}/TestCases`);
        successToast("Test case set as deprecated successfully");
      } else {
        this.props.getTestcase(this.state.testcaseId);
        failToast(`Can not find Test Case with ${this.state.testcaseId} id`);
      }
    });
  };
  confirmModal = () => {
    Confirm(
      "Set this Test Case as deprecated?",
      "You will not be able to see or edit this Test Case anymore",
      "No",
      "Delete",
      this.confirmDeprecate
    );
  };
  render() {
    var content;
    if (isEmpty(this.props.testcases.testcase) || this.props.testcases.loading) {
      content = <Spinner />;
    } else {
      content = (
        <div className='main-content--content'>
          <div className='header'>
            <div className='header--title'>Edit Test Case </div>
            <div className='header--buttons'>
              <div className='header--buttons--primary'></div>
              <div className='header--buttons--secondary clickable' onClick={e => this.confirmModal([])}>
                <i className='fas fa-trash-alt'></i>
              </div>
            </div>
          </div>
          <Input
            type='text'
            placeholder='Enter Test Case Name'
            label='Test case name*'
            validationMsg={this.state.errors.title}
            value={this.state.title}
            onChange={e => this.onChange(e)}
            name={"title"}
            onKeyDown={this.submitFormOnEnterKey}
          />
          <Textarea
            placeholder='Enter Test Case Description'
            label='Description*'
            validationMsg={this.state.errors.description}
            value={this.state.description}
            onChange={e => this.onChange(e)}
            name={"description"}
            onKeyDown={this.submitFormOnEnterKey}
          />
          <InputGroupDouble
            type='text'
            placeholder={["Enter Test Steps Here", "Enter Expected Result Here"]}
            label='Test steps*'
            validationMsg={this.state.errors.test_steps}
            values={this.state.test_steps}
            onChange={e => this.onChange(e)}
            id={["step", "expe"]}
            addColumn={<FullBtn placeholder='Add test steps' onClick={e => this.addColumnStep(e)} />}
            removeColumn={e => this.removeColumnStep(e)}
            required={true}
            onKeyDown={this.submitFormOnEnterKey}
          />
          <Input
            type='text'
            placeholder='Enter Result'
            label='Expected Result*'
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
          <div className='group-grid'>
            {this.state.pinnedGroups.map((group, index) => (
              <Switch
                key={index}
                label={group.title}
                value={checkIfElemInObjInArray(this.state.selectedGroupsObjects, group.id)}
                id={group.id}
                onClick={e => this.onChangeSwitch(e)}
                name={group.name}
              />
            ))}
          </div>
          <Input
            type='text'
            addColumnPlaceholder='Add test steps'
            placeholder='Enter Condition'
            label='Precondition'
            name={"preconditions"}
            value={this.state.preconditions}
            validationMsg={this.state.errors.preconditions}
            onChange={e => this.onChange(e)}
            onKeyDown={this.submitFormOnEnterKey}
          />
          <InputGroup
            type='text'
            placeholder='Add Link here'
            label='Links'
            values={this.state.links}
            onChange={e => this.onChange(e)}
            id={"link"}
            validationMsg={this.state.errors.links}
            addColumn={<FullBtn placeholder='Add links' onClick={e => this.addColumnLink(e)} />}
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
          <div className='flex-column-left mt-4'>
            <Btn
              className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
              label='Save Changes'
              type='text'
              onClick={e => this.submitForm(e)}
            />

            <UnderlineAnchor link={`/${this.state.projectId}/Testcase/${this.state.testcaseId}`} value={"Cancel"} />
          </div>
          <Checkbox
            label='Set old test case as deprecated'
            onClick={e => this.toggleDeprecated(e)}
            name='deprecated'
            value={this.state.deprecated}
          />
        </div>
      );
    }
    return (
      <div className='wrapper'>
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className='main-content main-content-grid'>
          <Header
            icon={<i className='fas fa-arrow-left'></i>}
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
  groups: state.groups,
  auth: state.auth
});

export default connect(mapStateToProps, { getTestcase, editTestcase, getGroups, setTestcaseDeprecated })(
  withRouter(EditTestCase)
);
