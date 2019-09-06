import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import PortraitTestCase from "../common/PortraitTestCase";
import Tag from "../common/Tag";
import Spinner from "../common/Spinner";

import { getTestcases } from "../../actions/testcaseActions";

class TestCaseContainer extends Component {
  componentDidMount() {
    this.props.getTestcases();
  }
  render() {
    var testcases = this.props.testcases;
    var { loading } = this.props.testcases;

    let content;

    if (testcases.testcases === null || loading) {
      content = <Spinner />;
    } else if (testcases.testcases !== null && testcases.testcases !== undefined) {
      testcases = this.props.testcases.testcases;
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
            ></PortraitTestCase>
          </React.Fragment>
        ));
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
