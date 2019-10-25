import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import isEmpty from "../../../../validation/isEmpty";
import { getGroups } from "../../../../actions/groupsActions";

import ListItem from "../../../../components/lists/ListItem";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import BtnAnchor from "../../../../components/common/BtnAnchor";
import Header from "../../../../components/common/Header";
import Spinner from "../../../../components/common/Spinner";

class Versions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      projectId: null,
      errors: {}
    };
  }
  componentDidMount() {
    this.setState({ projectId: this.props.match.params.projectId });
  }
  render() {
    // var { devices, loading } = this.props.devices;
    var versions = [
      { id: 1, title: "1.0" },
      { id: 2, title: "1.1" },
      { id: 3, title: "1.2" },
      { id: 4, title: "1.4" },
      { id: 5, title: "2.0" },
      { id: 6, title: "2.1" }
    ];
    var content;

    if (versions === null) {
      content = <Spinner />;
    } else if (!isEmpty(versions)) {
      content = versions.map((browser, index) => (
        <ListItem
          key={index}
          title={browser.title}
          link={`/${this.props.match.params.projectId}/EditVersion/${browser.id}`}
        />
      ));
    } else if (isEmpty(versions)) {
      content = <div className="testcase-container-no-content">There are no versions added yet</div>;
    }
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-code-branch"></i>}
            title={"Versions"}
            history={this.props}
            canGoBack={false}
            addBtn={
              <BtnAnchor
                type={"text"}
                label="Add Version"
                disabled={true}
                className={"a-btn a-btn-primary"}
                link={`/${this.state.projectId}/NewVersion`}
              />
            }
          />
          <div className="testcase-grid testcase-container">{content}</div>
        </div>
      </div>
    );
  }
}

Versions.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getGroups }
)(withRouter(Versions));
