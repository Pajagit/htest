import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import PortraitReport from "../common/PortraitReport";
// import LandscapeTestCase from "../common/LandscapeTestCase";
import Tag from "../common/Tag";
import Spinner from "../common/Spinner";
import isEmpty from "../../validation/isEmpty";
// import Pagination from "../pagination/Pagination";

import { getTestcases } from "../../actions/testcaseActions";

class ReportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: this.props.settings.settings,
      filters: this.props.settings.settings,
      testcases: this.props.reports,
      initialRender: true,
      projectId: null,
      page: 0
      //   dimensions: null
    };
    // this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    if (nextProps.settings && nextProps.settings.settings) {
      if (nextProps.settings.settings !== prevState.settings) {
        update.settings = nextProps.settings.settings;
        if (prevState.initialRender) {
          update.initialRender = false;
          nextProps.getTestcases(nextProps.match.params.projectId, nextProps.settings.settings, 1);
        }
      }
    }

    if (nextProps.testcases && nextProps.reports) {
      update.testcases = nextProps.reports;
      if (nextProps.reports.page !== prevState.page) {
        update.page = nextProps.reports.page;
      }
    }
    return Object.keys(update).length ? update : null;
  }
  componentDidMount() {
    // this.updateWindowDimensions();
    // window.addEventListener("resize", this.updateWindowDimensions);
  }
  componentWillUnmount() {
    // window.removeEventListener("resize", this.updateWindowDimensions);
  }
  //   updateWindowDimensions() {
  //     this.setState({
  //       dimensions: {
  //         width: this.container.offsetWidth,
  //         height: this.container.offsetHeight
  //       }
  //     });
  //   }
  render() {
    var projectId = this.props.match.params.projectId;
    var settingsLoading = this.props.settings.loading;
    // var testcases = this.props.testcases;
    var { loading } = this.props.testcases;
    // var pageCount = null;
    // var showPagination = false;
    // if (reports) {
    //   pageCount = reports.pages;

    //   if (pageCount > 1) {
    //     showPagination = true;
    //   }
    // }

    var reports = [
      {
        id: 1086,
        title: "Report 1",
        description: "test",
        expected_result: "Succesful login",
        preconditions: null,
        date: "2019-10-27T16:32:16.502Z",
        links: [],
        uploaded_files: [],
        test_steps: [{ id: 1945, value: "test", expected_result: null }],
        groups: [
          {
            id: 5,
            pinned: true,
            title: "Sanity",
            color: "LIBERTY"
          },
          {
            id: 2,
            pinned: true,
            title: "Regression",
            color: "CYAN_AZURE"
          },
          {
            id: 4,
            pinned: true,
            title: "Automated",
            color: "DARK_KHAKI"
          },
          {
            id: 6,
            pinned: true,
            title: "Performance",
            color: "AMARANTH"
          },
          {
            id: 7,
            pinned: true,
            title: "Login",
            color: "VERDIGRIS"
          },
          {
            id: 8,
            pinned: true,
            title: "Energy Management",
            color: "MEDIUM_SEA_GREEN"
          }
        ],
        author: { id: 11, first_name: "Aleksandar", last_name: "Pavlovic", position: "" },
        device: "Samsung Galaxy A7",
        browser: "Chrome 10.2",
        version: 2.1,
        operatingSystem: "Android KitKat 4.4",
        environment: "Development",
        additionalPrecondition: "Log in application",
        comment: "Not so long comment",
        status: "passed"
      },
      {
        id: 1086,
        title: "Report 2",
        description: "test",
        expected_result: "Succesful login",
        preconditions: null,
        date: "2019-10-27T16:32:16.502Z",
        links: [],
        uploaded_files: [],
        test_steps: [{ id: 1945, value: "test", expected_result: null }],
        groups: [
          {
            id: 5,
            pinned: true,
            title: "Sanity",
            color: "LIBERTY"
          },
          {
            id: 2,
            pinned: true,
            title: "Regression",
            color: "CYAN_AZURE"
          },
          {
            id: 4,
            pinned: true,
            title: "Automated",
            color: "DARK_KHAKI"
          },
          {
            id: 6,
            pinned: true,
            title: "Performance",
            color: "AMARANTH"
          },
          {
            id: 7,
            pinned: true,
            title: "Login",
            color: "VERDIGRIS"
          },
          {
            id: 8,
            pinned: true,
            title: "Energy Management",
            color: "MEDIUM_SEA_GREEN"
          }
        ],
        author: { id: 11, first_name: "Aleksandar", last_name: "Pavlovic", position: "" },
        device: "Samsung Galaxy A7",
        browser: "Chrome 10.2",
        version: 2.1,
        operatingSystem: "Android KitKat 4.4",
        environment: "Development",
        additionalPrecondition: "Log in application",
        comment: "Not so long comment",
        status: "failed"
      },
      {
        id: 1086,
        title: "Report 3",
        description: "test",
        expected_result: "Succesful login",
        preconditions: null,
        date: "2019-10-27T16:32:16.502Z",
        links: [],
        uploaded_files: [],
        test_steps: [{ id: 1945, value: "test", expected_result: null }],
        groups: [
          {
            id: 5,
            pinned: true,
            title: "Sanity",
            color: "LIBERTY"
          },
          {
            id: 2,
            pinned: true,
            title: "Regression",
            color: "CYAN_AZURE"
          },
          {
            id: 4,
            pinned: true,
            title: "Automated",
            color: "DARK_KHAKI"
          },
          {
            id: 6,
            pinned: true,
            title: "Performance",
            color: "AMARANTH"
          },
          {
            id: 7,
            pinned: true,
            title: "Login",
            color: "VERDIGRIS"
          },
          {
            id: 8,
            pinned: true,
            title: "Energy Management",
            color: "MEDIUM_SEA_GREEN"
          }
        ],
        author: { id: 11, first_name: "Aleksandar", last_name: "Pavlovic", position: "" },
        device: "Samsung Galaxy A7",
        browser: "Chrome 10.2",
        version: 2.1,
        operatingSystem: "Android KitKat 4.4",
        environment: "Development",
        additionalPrecondition: "Log in application",
        comment: "Not so long comment",
        status: "failed"
      },

      {
        id: 1086,
        title: "Report 4",
        description: "test",
        expected_result: "Succesful login",
        preconditions: null,
        date: "2019-10-27T16:32:16.502Z",
        links: [],
        uploaded_files: [],
        test_steps: [{ id: 1945, value: "test", expected_result: null }],
        groups: [
          {
            id: 5,
            pinned: true,
            title: "Sanity",
            color: "LIBERTY"
          },
          {
            id: 2,
            pinned: true,
            title: "Regression",
            color: "CYAN_AZURE"
          },
          {
            id: 4,
            pinned: true,
            title: "Automated",
            color: "DARK_KHAKI"
          },
          {
            id: 6,
            pinned: true,
            title: "Performance",
            color: "AMARANTH"
          },
          {
            id: 7,
            pinned: true,
            title: "Login",
            color: "VERDIGRIS"
          },
          {
            id: 8,
            pinned: true,
            title: "Energy Management",
            color: "MEDIUM_SEA_GREEN"
          }
        ],
        author: { id: 11, first_name: "Aleksandar", last_name: "Pavlovic", position: "" },
        device: "Samsung Galaxy A7",
        browser: "Chrome 10.2",
        version: 2.1,
        operatingSystem: "Android KitKat 4.4",
        environment: "Development",
        additionalPrecondition: "Log in application",
        comment: "Not so long comment",
        status: "blocked"
      },
      {
        id: 1086,
        title: "Report 5",
        description: "test",
        expected_result: "Succesful login",
        preconditions: null,
        date: "2019-10-27T16:32:16.502Z",
        links: [],
        uploaded_files: [],
        test_steps: [{ id: 1945, value: "test", expected_result: null }],
        groups: [
          {
            id: 5,
            pinned: true,
            title: "Sanity",
            color: "LIBERTY"
          },
          {
            id: 2,
            pinned: true,
            title: "Regression",
            color: "CYAN_AZURE"
          },
          {
            id: 4,
            pinned: true,
            title: "Automated",
            color: "DARK_KHAKI"
          },
          {
            id: 6,
            pinned: true,
            title: "Performance",
            color: "AMARANTH"
          },
          {
            id: 7,
            pinned: true,
            title: "Login",
            color: "VERDIGRIS"
          },
          {
            id: 8,
            pinned: true,
            title: "Energy Management",
            color: "MEDIUM_SEA_GREEN"
          }
        ],
        author: { id: 11, first_name: "Aleksandar", last_name: "Pavlovic", position: "" },
        device: "Samsung Galaxy A7",
        browser: "Chrome 10.2",
        version: 2.1,
        operatingSystem: "Android KitKat 4.4",
        environment: "Development",
        additionalPrecondition: "Log in application",
        comment: "Not so long comment",
        status: "passed"
      },
      {
        id: 1086,
        title: "Report 6",
        description: "test",
        expected_result: "Succesful login",
        preconditions: null,
        date: "2019-10-27T16:32:16.502Z",
        links: [],
        uploaded_files: [],
        test_steps: [{ id: 1945, value: "test", expected_result: null }],
        groups: [
          {
            id: 5,
            pinned: true,
            title: "Sanity",
            color: "LIBERTY"
          },
          {
            id: 2,
            pinned: true,
            title: "Regression",
            color: "CYAN_AZURE"
          },
          {
            id: 4,
            pinned: true,
            title: "Automated",
            color: "DARK_KHAKI"
          },
          {
            id: 6,
            pinned: true,
            title: "Performance",
            color: "AMARANTH"
          },
          {
            id: 7,
            pinned: true,
            title: "Login",
            color: "VERDIGRIS"
          },
          {
            id: 8,
            pinned: true,
            title: "Energy Management",
            color: "MEDIUM_SEA_GREEN"
          }
        ],
        author: { id: 11, first_name: "Aleksandar", last_name: "Pavlovic", position: "" },
        device: "Samsung Galaxy A7",
        browser: "Chrome 10.2",
        version: 2.1,
        operatingSystem: "Android KitKat 4.4",
        environment: "Development",
        additionalPrecondition: "Log in application",
        comment: "Not so long comment",
        status: "passed"
      }
    ];

    let content;
    let grid = "";
    // var pagination = "";
    if (reports === null || loading || this.state.settings === null || settingsLoading) {
      content = <Spinner />;
    } else if (reports.length > 0 && this.state.settings.view_mode === 1) {
      //   testcases = this.props.reports;
      //   if (showPagination) {
      //     pagination = (
      //       <Pagination
      //         pageCount={pageCount}
      //         page={this.state.page}
      //         searchTerm={this.state.searchTerm}
      //         projectId={projectId}
      //         // width={this.state.dimensions.width}
      //       />
      //     );
      //   }
      grid = "testcase-grid";
      content =
        reports &&
        reports.map((testcase, index) => (
          <React.Fragment key={index}>
            <PortraitReport
              title={testcase.title}
              tags={testcase.groups.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Tag title={group.title} color={group.color} isRemovable={false} />
                </React.Fragment>
              ))}
              author={testcase.author}
              date={testcase.date}
              description={testcase.description}
              device={testcase.device}
              browser={testcase.browser}
              version={testcase.version}
              operatingSystem={testcase.operatingSystem}
              status={testcase.status}
              environment={testcase.environment}
              additionalPrecondition={testcase.additionalPrecondition}
              comment={testcase.comment}
              id={testcase.id}
              projectId={projectId}
              onClick={e => this.props.history.push(`/${projectId}/TestCase/${testcase.id}`)}
            ></PortraitReport>
          </React.Fragment>
        ));
    }
    // else if (reports.testcases.length > 0 && this.state.settings.view_mode === 2) {
    //   testcases = this.props.reports;
    //   testcases = this.props.reports;
    //   //   if (showPagination) {
    //   //     pagination = (
    //   //       <Pagination
    //   //         pageCount={pageCount}
    //   //         page={this.state.page}
    //   //         searchTerm={this.state.searchTerm}
    //   //         projectId={projectId}
    //   //         width={this.state.dimensions.width}
    //   //       />
    //   //     );
    //   //   }
    //   grid = "testcase-grid grid-none";
    //   content =
    //     reports &&
    //     reports.map((testcase, index) => (
    //       <React.Fragment key={index}>
    //         <LandscapeTestCase
    //           title={testcase.title}
    //           tags={testcase.groups.map((group, groupIndex) => (
    //             <React.Fragment key={groupIndex}>
    //               <Tag title={group.title} color={group.color} isRemovable={false} />
    //             </React.Fragment>
    //           ))}
    //           author={testcase.author}
    //           status={testcase.status}
    //           date={testcase.date}
    //           description={testcase.description}
    //           id={testcase.id}
    //           projectId={projectId}
    //           onClick={e => this.props.history.push(`/${projectId}/TestCase/${testcase.id}`)}
    //         ></LandscapeTestCase>
    //       </React.Fragment>
    //     ));
    // }
    else {
      if (
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
          <div className="testcase-container-no-content padding">There are no test cases created for this project</div>
        );
      }
    }

    return (
      <div>
        <div
          //  ref={el => (this.container = el)}
          className={`${grid} testcase-container`}
        >
          {content}
        </div>
        {/* {pagination} */}
      </div>
    );
  }
}

ReportContainer.propTypes = {
  testcases: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases,
  settings: state.settings
});

export default connect(
  mapStateToProps,
  { getTestcases }
)(withRouter(ReportContainer));
