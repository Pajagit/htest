import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getOperatingSystems, usedOperatingSystem } from "../../../../actions/osActions";
import { superAndProjectAdminPermissions } from "../../../../permissions/Permissions";
import isEmpty from "../../../../validation/isEmpty";

import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import PortraitOs from "../../../../components/common/PortraitOs";
import BtnAnchor from "../../../../components/common/BtnAnchor";
import Header from "../../../../components/common/Header";
import Spinner from "../../../../components/common/Spinner";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";

class OperatingSystems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      projectId: null,
      user: this.props.auth.user,
      errors: {}
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};
    var { user } = nextProps.auth;
    if (nextProps.auth && nextProps.auth.user) {
      if (nextProps.auth.user !== prevState.user) {
        update.user = user;
      }
      var { isValid } = superAndProjectAdminPermissions(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );
      if (!isValid) {
        nextProps.history.push(`/${nextProps.match.params.projectId}/TestCases`);
      }
    }

    return Object.keys(update).length ? update : null;
  }
  componentDidMount() {
    this.setState({ projectId: this.props.match.params.projectId });
    this.props.getOperatingSystems(this.props.match.params.projectId);
  }

  setUsed(os) {
    var is_used = !os.used;

    this.props.usedOperatingSystem(os.id, is_used, res => {
      if (res.status === 200) {
        if (is_used) {
          successToast(res.data.success);
        } else if (!is_used) {
          successToast(res.data.success);
        }
        this.props.getOperatingSystems(this.props.match.params.projectId);
      } else {
        failToast(res.error);
      }
    });
  }

  render() {
    var { oss, loading } = this.props.oss;
    var osContainer;
    var content;
    if (oss === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(oss && oss.oss)) {
      osContainer = oss.oss.map((os, index) => (
        <PortraitOs
          key={index}
          title={os.title}
          resolution={os.screen_resolution}
          used={os.used}
          os={os.title}
          id={os.id}
          onClick={e => this.setUsed(os)}
          projectId={this.props.match.params.projectId}
        />
      ));
      content = <div className='testcase-grid testcase-container'>{osContainer}</div>;
    } else if (isEmpty(oss && oss.oss)) {
      content = <div className='testcase-container-no-content'>There are no operating systems added yet</div>;
    }

    return (
      <div className='wrapper'>
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className='main-content main-content-grid'>
          <Header
            icon={<i className='fab fa-ubuntu'></i>}
            title={"Operating Systems"}
            history={this.props}
            canGoBack={false}
            addBtn={
              <BtnAnchor
                type={"text"}
                label='Add OS'
                disabled={true}
                className={"a-btn a-btn-primary"}
                link={`/${this.state.projectId}/NewOperatingSystem`}
              />
            }
          />
          {content}
        </div>
      </div>
    );
  }
}

OperatingSystems.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  oss: state.oss,
  errors: state.errors
});

export default connect(mapStateToProps, { getOperatingSystems, usedOperatingSystem })(withRouter(OperatingSystems));
