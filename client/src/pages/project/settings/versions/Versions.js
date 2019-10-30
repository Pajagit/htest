import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import isEmpty from "../../../../validation/isEmpty";
import { getVersions, editVersion } from "../../../../actions/versionAction";

import PortraitVersions from "../../../../components/common/PortraitVersions";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import BtnAnchor from "../../../../components/common/BtnAnchor";
import Header from "../../../../components/common/Header";
import Spinner from "../../../../components/common/Spinner";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";

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
    this.props.getVersions(this.props.match.params.projectId);
  }

  setUsed(version) {
    var editedVersion = {};
    editedVersion.deprecated = false;
    editedVersion.used = !version.used;
    editedVersion.version = version.version;

    this.props.editVersion(version.id, editedVersion, res => {
      if (res.status === 200) {
        if (editedVersion.used) {
          successToast("Version will now be used in reports");
        } else if (!editedVersion.used) {
          successToast("Version is no longer used in reports");
        }

        this.props.getVersion(this.props.match.params.projectId);
      } else {
        failToast("Version editing failed");
      }
    });
  }
  render() {
    var { versions, loading } = this.props.versions;
    var content;

    if (versions === null || loading) {
      content = <Spinner />;
    } else if (!isEmpty(versions)) {
      content = versions.versions.map((version, index) => (
        <PortraitVersions
          key={index}
          version={version.version}
          used={version.used}
          id={version.id}
          projectId={this.props.match.params.projectId}
          onClick={e => this.setUsed(version)}
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
  errors: PropTypes.object.isRequired,
  versions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  versions: state.versions
});

export default connect(
  mapStateToProps,
  { getVersions, editVersion }
)(withRouter(Versions));
