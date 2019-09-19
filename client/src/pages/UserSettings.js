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
import placeholderImg from "../img/user-placeholder.png";

class UserSettings extends Component {
  componentDidMount() {
    this.props.getUsers();
  }
  render() {
    var { users, loading } = this.props.users;
    // console.log(users);
    var content;
    if (users === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(users)) {
      content =
        users &&
        users.map((user, index) => (
          <ListItem
            key={index}
            title={user.first_name}
            img={user.image_url ? user.image_url : placeholderImg}
            list={user.projects.map((project, projectIndex) => (
              <React.Fragment key={projectIndex}>{project.title}</React.Fragment>
            ))}
          />
        ));
    } else {
      content = <div className="testcase-container-no-content">There are no users created yet</div>;
    }

    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <SettingPanel props={this.props} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-user-cog"></i>}
            title={"User Settings"}
            history={this.props}
            canGoBack={false}
            addBtn={<BtnAnchor type={"text"} label="Add User" className={"a-btn a-btn-primary"} link={`AddUser`} />}
          />
          <div className="list-item-container">{content}</div>
        </div>
      </div>
    );
  }
}

UserSettings.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  // testcases: state.testcases
  auth: state.auth,
  errors: state.errors,
  users: state.users
});

export default connect(
  mapStateToProps,
  { getUsers }
)(withRouter(UserSettings));
