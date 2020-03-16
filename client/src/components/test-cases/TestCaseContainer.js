import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";

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
      settings: this.props.settings.testcase_settings,
      filters: this.props.settings.testcase_settings,
      testcases: this.props.testcases.testcases,
      initialRender: true,
      projectId: null,
      page: 0,
      dimensions: null
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    if (nextProps.settings && nextProps.settings.testcase_settings) {
      if (nextProps.settings.testcase_settings !== prevState.settings) {
        update.settings = nextProps.settings.testcase_settings;
        if (prevState.initialRender) {
          update.initialRender = false;
          var filters = nextProps.settings.testcase_settings;
          filters.date_from = nextProps.settings.testcase_settings.date_from
            ? moment(nextProps.settings.testcase_settings.date_from).format("YYYY-MM-DD")
            : null;
          filters.date_to = nextProps.settings.testcase_settings.date_to
            ? moment(nextProps.settings.testcase_settings.date_to).format("YYYY-MM-DD")
            : null;
          nextProps.getTestcases(nextProps.match.params.projectId, filters, 1);
        }
      }
    }

    if (nextProps.testcases && nextProps.testcases.testcases) {
      update.testcases = nextProps.testcases.testcases;
      if (nextProps.testcases.testcases.page !== prevState.page) {
        update.page = nextProps.testcases.testcases.page;
      }
    }
    return Object.keys(update).length ? update : null;
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({
      dimensions: {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight
      }
    });
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
    if (
      testcases.testcases === null ||
      loading ||
      this.state.settings === null ||
      settingsLoading ||
      this.state.dimensions === null
    ) {
      content = <Spinner />;
    } else if (
      testcases &&
      testcases.testcases &&
      testcases.testcases.testcases &&
      testcases.testcases.testcases.length > 0 &&
      this.state.settings.view_mode === 1
    ) {
      testcases = this.props.testcases.testcases;
      if (showPagination) {
        pagination = (
          <Pagination
            pageCount={pageCount}
            page={this.state.page}
            searchTerm={this.state.searchTerm}
            projectId={projectId}
            width={this.state.dimensions && this.state.dimensions.width}
          />
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
              history={this.props.history}
              onClick={e => this.props.history.push(`/${projectId}/TestCase/${testcase.id}`)}
              isValidWrite={this.props.isValidWrite}
              onClickAddReport={e => {
                e.stopPropagation();
                this.props.history.push(`/${projectId}/NewReport/${testcase.id}`);
              }}
            ></PortraitTestCase>
          </React.Fragment>
        ));
    } else if (
      testcases &&
      testcases.testcases &&
      testcases.testcases.testcases &&
      testcases.testcases.testcases.length > 0 &&
      this.state.settings.view_mode === 2
    ) {
      testcases = this.props.testcases.testcases;
      testcases = this.props.testcases.testcases;
      if (showPagination) {
        pagination = (
          <Pagination
            pageCount={pageCount}
            page={this.state.page}
            searchTerm={this.state.searchTerm}
            projectId={projectId}
            width={this.state.dimensions.width}
          />
        );
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
              onClickAddReport={e => this.props.history.push(`/${projectId}/NewReport/${testcase.id}`)}
              isValidWrite={this.props.isValidWrite}
            ></LandscapeTestCase>
          </React.Fragment>
        ));
    } else {
      if (
        !isEmpty(this.state.settings && this.state.settings.users) ||
        !isEmpty(this.state.settings && this.state.settings.groups) ||
        (this.state.settings && this.state.settings.date_from !== null) ||
        (this.state.settings && this.state.settings.date_to !== null)
      ) {
        content = (
          <div className='testcase-container-no-content padding'>There are no test cases matching selected filters</div>
        );
      } else {
        content = (
          <div className='testcase-container-no-content padding'>There are no test cases created for this project</div>
        );
      }
    }

    return (
      <div>
        <div ref={el => (this.container = el)} className={`${grid} testcase-container`}>
          {content}
        </div>
        {pagination}
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

export default connect(mapStateToProps, { getTestcases })(withRouter(TestCaseContainer));
