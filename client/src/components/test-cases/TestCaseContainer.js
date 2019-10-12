import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import PortraitTestCase from "../common/PortraitTestCase";
import LandscapeTestCase from "../common/LandscapeTestCase";
import Tag from "../common/Tag";
import Spinner from "../common/Spinner";
import isEmpty from "../../validation/isEmpty";

import { getTestcases } from "../../actions/testcaseActions";

class TestCaseContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {},
      viewOption: ""
    };
  }
  componentDidMount() {
    var projectId = this.props.match.params.projectId;
    this.props.getTestcases(projectId);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    var projectId = nextProps.match.params.projectId;

    if (nextProps.filters !== prevState.filters) {
      update.filters = nextProps.filters;
      nextProps.getTestcases(projectId, nextProps.filters);
    }
    if (nextProps.viewOption !== prevState.viewOption) {
      update.viewOption = nextProps.viewOption;
    }
    return Object.keys(update).length ? update : null;
  }

  render() {
    var projectId = this.props.match.params.projectId;
    var testcases = this.props.testcases;
    var { loading } = this.props.testcases;
    let content;
    let grid = "";

    if (testcases.testcases === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(testcases.testcases) && this.state.viewOption === "Grid") {
      testcases = this.props.testcases.testcases;
      grid = "testcase-grid";
      content =
        testcases &&
        testcases.map((testcase, index) => (
          <React.Fragment key={index}>
            <PortraitTestCase
              title={testcase.title}
              tags={testcase.groups.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Tag title={group.title} color={group.color} isRemovable={false} />
                </React.Fragment>
              ))}
              author={testcase.author}
              date={testcase.date}
              description={testcase.description}
              id={testcase.id}
              projectId={projectId}
              onClick={e => this.props.history.push(`/${projectId}/TestCase/${testcase.id}`)}
            ></PortraitTestCase>
          </React.Fragment>
        ));
    } else if (!isEmpty(testcases.testcases) && this.state.viewOption === "List") {
      testcases = this.props.testcases.testcases;
      grid = "testcase-grid grid-none";
      content =
        testcases &&
        testcases.map((testcase, index) => (
          <React.Fragment key={index}>
            <LandscapeTestCase
              title={testcase.title}
              tags={testcase.groups.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Tag title={group.title} color={group.color} isRemovable={false} />
                </React.Fragment>
              ))}
              author={testcase.author}
              date={testcase.date}
              description={testcase.description}
              id={testcase.id}
              projectId={projectId}
              onClick={e => this.props.history.push(`/${projectId}/TestCase/${testcase.id}`)}
            ></LandscapeTestCase>
          </React.Fragment>
        ));
    } else if (
      !isEmpty(this.state.filters.users) ||
      !isEmpty(this.state.filters.groups) ||
      !isEmpty(this.state.filters.dateFrom) ||
      !isEmpty(this.state.filters.dateTo)
    ) {
      content = <div className="testcase-container-no-content">There are no test cases matching selected filters</div>;
    } else {
      content = <div className="testcase-container-no-content">There are no test cases created for this project</div>;
    }

    return <div className={`${grid} testcase-container`}>{content}</div>;
  }
}

TestCaseContainer.propTypes = {
  testcases: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases
});

export default connect(
  mapStateToProps,
  { getTestcases }
)(withRouter(TestCaseContainer));
