import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import PortraitTestCase from "../common/PortraitTestCase";
import Tag from "../common/Tag";
import Spinner from "../common/Spinner";
import isEmpty from "../../validation/isEmpty";

import { getTestcases } from "../../actions/testcaseActions";

class TestCaseContainer extends Component {
  componentDidMount() {
    var projectId = this.props.match.params.projectId;
    this.props.getTestcases(projectId);
  }
  render() {
    var projectId = this.props.match.params.projectId;
    var testcases = this.props.testcases;
    var { loading } = this.props.testcases;

    let content;

    if (testcases.testcases === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(testcases.testcases)) {
      testcases = this.props.testcases.testcases;
      content =
        testcases &&
        testcases.map((testcase, index) => (
          <React.Fragment key={index}>
            <PortraitTestCase
              title={testcase.title}
              tags={testcase.groups.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Tag title={group.value} color={group.color} isRemovable={false} />
                </React.Fragment>
              ))}
              author={testcase.author}
              date={testcase.date}
              description={testcase.description}
              id={testcase.id}
              projectId={projectId}
            ></PortraitTestCase>
          </React.Fragment>
        ));
    } else {
      content = <div className="testcase-container-no-content">There are no test cases created for this project</div>;
    }

    return <div className="testcase-grid testcase-container">{content}</div>;
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
