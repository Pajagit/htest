import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getUsers } from "../actions/userActions";
import isEmpty from "../validation/isEmpty";

import GlobalPanel from "../components/global-panel/GlobalPanel";
import SettingPanel from "../components/settings-panel/SettingPanel";
import BtnAnchor from "../components/common/BtnAnchor";
import Spinner from "../components/common/Spinner";
import ListItem from "../components/lists/ListItem";
import Header from "../components/common/Header";
import stenaImg from "../img/stena-bulk.jpg";

class ProjectSettings extends Component {
  componentDidMount() {
    this.props.getUsers();
  }
  render() {
    var { users, loading } = this.props.users;
    var content;
    if (users === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(users)) {
      content = (
        <ListItem title={"Stena Orbit"} img={stenaImg} list={"Aleksandar Pavlovic, Jana Antic, Sandra Jeremenkovic"} />
      );
    } else {
      content = <div className="testcase-container-no-content">There are no projects created yet</div>;
    }

    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <SettingPanel props={this.props} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-project-diagram"></i>}
            title={"Project Settings"}
            history={this.props}
            canGoBack={false}
            addBtn={<BtnAnchor type={"text"} label="Add Project" className={"a-btn a-btn-primary"} link={`AddUser`} />}
          />
          <div className="list-item-container">{content}</div>
        </div>
      </div>
    );
  }
}

ProjectSettings.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  users: state.users
});

export default connect(
  mapStateToProps,
  { getUsers }
)(withRouter(ProjectSettings));
