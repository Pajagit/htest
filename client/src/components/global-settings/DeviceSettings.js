import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getUsers } from "../../actions/userActions";
import isEmpty from "../../validation/isEmpty";

import GlobalPanel from "../global-panel/GlobalPanel";
import SettingPanel from "../settings-panel/SettingPanel";
import BtnAnchor from "../common/BtnAnchor";
import Spinner from "../common/Spinner";
import ListItem from "../lists/ListItem";
import Header from "../common/Header";

class DeviceSettings extends Component {
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
        <ListItem
          title={"iPhone 6s"}
          img={""}
          list={"10.2 Retina, 4.7” 1334x750 - 326ppi 06f111c45fce3e4b5d"}
          msg={"Nis"}
        />
      );
    } else {
      content = <div className="testcase-container-no-content">There are no devices added yet</div>;
    }

    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <SettingPanel props={this.props} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-laptop"></i>}
            title={"Device Settings"}
            history={this.props}
            canGoBack={false}
            addBtn={<BtnAnchor type={"text"} label="Add Device" className={"a-btn a-btn-primary"} link={`AddUser`} />}
          />
          <div className="list-item-container">{content}</div>
        </div>
      </div>
    );
  }
}

DeviceSettings.propTypes = {
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
)(withRouter(DeviceSettings));
