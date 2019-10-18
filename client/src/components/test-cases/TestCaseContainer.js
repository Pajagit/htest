import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import PortraitTestCase from "../common/PortraitTestCase";
import LandscapeTestCase from "../common/LandscapeTestCase";
import Tag from "../common/Tag";
import Spinner from "../common/Spinner";
import isEmpty from "../../validation/isEmpty";
import Pagination from "../pagination/Pagination";

import { getTestcases } from "../../actions/testcaseActions";

class TestCaseContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {},
      filters: this.props.settings.settings,
      projectId: null,
      page: this.props.match.params.page
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    var projectId = nextProps.match.params.projectId;
    if (nextProps.settings && nextProps.settings.settings) {
      if (nextProps.settings.settings !== prevState.filters) {
        update.filters = nextProps.settings.settings;
        if (prevState.filters === null || prevState.projectId === null) {
          update.projectId = projectId;
          nextProps.getTestcases(projectId, nextProps.settings.settings, nextProps.match.params.page);
        }
      }
      update.settings = nextProps.settings;
    }

    if (nextProps.match.params.page !== prevState.page) {
      update.page = nextProps.match.params.page;
      nextProps.getTestcases(projectId, nextProps.settings.settings, nextProps.match.params.page);
    }
    return Object.keys(update).length ? update : null;
  }

  render() {
    var projectId = this.props.match.params.projectId;
    var settingsLoading = this.props.settings.loading;
    var testcases = this.props.testcases;
    var { loading } = this.props.testcases;

    var pageCount = null;
    var showPagination = false;
    if (testcases.testcases) {
      pageCount = testcases.testcases.pages;

      if (pageCount > 1) {
        showPagination = true;
      }
    }
    let content;
    let grid = "";
    var pagination = "";
    if (testcases.testcases === null || loading || this.state.filters === null || settingsLoading) {
      content = <Spinner />;
    } else if (!isEmpty(testcases.testcases) && this.state.filters.view_mode === 1) {
      testcases = this.props.testcases.testcases;
      if (showPagination) {
        pagination = (
          <Pagination pageCount={pageCount} page={this.props.match.params.page} projectId={this.state.projectId} />
        );
      }
      grid = "testcase-grid";
      content =
        testcases.testcases &&
        testcases.testcases.map((testcase, index) => (
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
    } else if (!isEmpty(testcases.testcases) && this.state.filters.view_mode === 2) {
      testcases = this.props.testcases.testcases;
      testcases = this.props.testcases.testcases;
      if (showPagination) {
        pagination = <Pagination pageCount={pageCount} projectId={this.state.projectId} />;
      }
      grid = "testcase-grid grid-none";
      content =
        testcases.testcases &&
        testcases.testcases.map((testcase, index) => (
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
      !isEmpty(this.state.settings && this.state.settings.users) ||
      !isEmpty(this.state.settings && this.state.settings.groups) ||
      (this.state.settings && this.state.settings.date_from !== null) ||
      (this.state.settings && this.state.settings.date_to !== null)
    ) {
      content = (
        <div className="testcase-container-no-content padding">There are no test cases matching selected filters</div>
      );
    } else {
      content = (
        <div className="testcase-container-no-content padding">
          There are no test cases created or none match the filters
        </div>
      );
    }

    return (
      <div>
        <div className={`${grid} testcase-container`}>{content}</div> {pagination}
      </div>
    );
  }
}

TestCaseContainer.propTypes = {
  testcases: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases,
  settings: state.settings
});

export default connect(
  mapStateToProps,
  { getTestcases }
)(withRouter(TestCaseContainer));
