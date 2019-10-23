import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { clearProject } from "../../../actions/projectActions";
import GlobalPanel from "../../../components/global-panel/GlobalPanel";
import Header from "../../../components/common/Header";

class GlobalStatistics extends Component {
  componentWillUnmount() {
    this.props.clearProject();
  }
  render() {
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <div className="main-content full-content-grid">
          <Header
            icon={<i className="fas fa-chart-pie"></i>}
            title={"Notifications"}
            history={this.props}
            canGoBack={false}
          />
          <div className="list-item-container">
            <div className="header">
              <div className="header--title">Global Statistics </div>
              <div className="header--buttons">
                <div className="header--buttons--primary"></div>
                <div
                  className="header--buttons--secondary clickable"
                  //    onClick={e => this.confirmModal([])}
                >
                  {/* <i className="fas fa-trash-alt"></i> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

GlobalStatistics.propTypes = {
  projects: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projects: state.projects
  // auth: state.auth,
});

export default connect(
  mapStateToProps,
  { clearProject }
)(withRouter(GlobalStatistics));
