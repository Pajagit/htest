import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getGroups } from "../../../../actions/groupsActions";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
// import BtnAnchor from "../common/BtnAnchor";
import ListItem from "../../../../components/lists/ListItem";
import Header from "../../../../components/common/Header";
import SetupProperty from "../../../../components/common/SetupProperty";

class TestSetup extends Component {
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
    var setupProperties = [
      { id: 0, title: "Devices/Simulators" },
      { id: 1, title: "Browsers" },
      { id: 2, title: "Versions" },
      { id: 3, title: "Operating systems" },
      { id: 4, title: "Environments" },
      { id: 5, title: "Aditional conditions" },
      { id: 6, title: "Upload files" }
    ];
    // var content;
    // content = setupProperties.map((setupProperty, index) => (
    //   <ListItem
    //     key={index}
    //     title={setupProperty.title}
    //     // img={project.image_url ? project.image_url : projectImagePlaceholder}
    //     // link={`/EditProject/${project.id}`}
    //     // list={project.users.map((user, index) => (
    //     //   <React.Fragment key={index}>
    //     //     {user.first_name ? user.first_name + " " + user.last_name : user.email}
    //     //     {project.users.length - 1 > index ? `, ` : ``}
    //     //   </React.Fragment>
    //     // ))}
    //   />
    // ));
    return (
      <div className='wrapper'>
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className='main-content main-content-grid'>
          <Header icon={<i className='fas fa-cogs'></i>} title={"Test Setup"} history={this.props} canGoBack={false} />
          {/* <div className='list-item-container'>{content}</div> */}
          <SetupProperty setupProperties={setupProperties} />
        </div>
      </div>
    );
  }
}

TestSetup.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { getGroups })(withRouter(TestSetup));
