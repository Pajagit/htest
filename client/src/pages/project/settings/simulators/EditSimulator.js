import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getSimulator, editSimulator, removeSimulator } from "../../../../actions/simulatorActions";
import { getMobileOs } from "../../../../actions/mobileOsActions";
import { getOffices } from "../../../../actions/officeActions";
import { superAndProjectAdminPermissions } from "../../../../permissions/Permissions";
import Input from "../../../../components/common/Input";
import Btn from "../../../../components/common/Btn";
import UnderlineAnchor from "../../../../components/common/UnderlineAnchor";
import SimulatorValidation from "../../../../validation/SimulatorValidation";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";
import { clearErrors } from "../../../../actions/errorsActions";
import isEmpty from "../../../../validation/isEmpty";

import SearchDropdown from "../../../../components/common/SearchDropdown";
import Spinner from "../../../../components/common/Spinner";
import Switch from "../../../../components/common/Switch";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import ProjectPanel from "../../../../components/project-panel/ProjectPanel";
import Confirm from "../../../../components/common/Confirm";
import Header from "../../../../components/common/Header";

class EditSimulator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      offices: this.props.offices.offices,
      office: [],
      simulator: this.props.simulators.simulator,
      officesFormatted: [],
      title: "",
      resolution: "",
      dpi: "",
      screen_size: "",
      udid: "",
      retina: false,
      errors: {}
    };
    this.selectOs = this.selectOs.bind(this);
  }
  componentDidMount() {
    this.props.getSimulator(this.props.match.params.simulatorId);
    this.props.getMobileOs();
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};

    if (nextProps.auth && nextProps.auth.user) {
      var { isValid } = superAndProjectAdminPermissions(
        nextProps.auth.user.projects,
        nextProps.match.params.projectId,
        nextProps.auth.user.superadmin
      );
    }

    if (!isValid) {
      nextProps.history.push(`/${nextProps.match.params.projectId}/Simulators`);
    }
    var { simulator } = nextProps.simulators;
    if (nextProps.simulators.simulator !== prevState.simulator) {
      if (prevState.initialRender) {
        update.initialRender = false;

        update.title = simulator.title;
        update.resolution = simulator.resolution ? simulator.resolution : "";
        update.dpi = simulator.dpi ? simulator.dpi : "";
        update.udid = simulator.udid ? simulator.udid : "";
        update.emulator = simulator.emulator;
        update.retina = simulator.retina;
        update.screen_size = simulator.screen_size ? simulator.screen_size : "";
        update.os = { id: simulator.os, title: simulator.os };
      }
    }

    if (nextProps.offices && nextProps.offices.offices) {
      if (nextProps.offices.offices !== prevState.offices) {
        update.offices = nextProps.offices.offices;

        var offices = nextProps.offices.offices;
        var i;
        for (i = 0; i < offices.length; i++) {
          offices[i].title = offices[i]["city"];
          delete offices[i].city;
        }
        update.officesFormatted = offices;
      }
    }
    if (nextProps.mobileOSs && nextProps.mobileOSs.mobileOSs) {
      if (nextProps.mobileOSs.mobileOSs !== prevState.mobileOSs) {
        update.mobileOSs = nextProps.mobileOSs.mobileOSs;

        var mobileOSs = nextProps.mobileOSs.mobileOSs.operating_systems;

        update.mobileOSs = mobileOSs;
      }
    }

    return Object.keys(update).length ? update : null;
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.checkValidation();
    });
  }

  checkValidation() {
    var simulatorData = {};
    simulatorData.title = this.state.title;
    simulatorData.resolution = this.state.resolution;
    simulatorData.dpi = this.state.dpi;
    simulatorData.udid = this.state.udid;
    simulatorData.retina = this.state.retina;
    simulatorData.screen_size = this.state.screen_size;
    simulatorData.office_id = this.state.office ? this.state.office.id : null;
    simulatorData.os = this.state.os.title;
    simulatorData.emulator = this.state.emulator;

    const { errors } = SimulatorValidation(simulatorData);
    this.setState({ errors });
  }

  submitForm(e) {
    e.preventDefault();
    this.props.clearErrors();
    this.setState({ errors: {} });
    var simulatorData = {};

    simulatorData.title = this.state.title;
    simulatorData.resolution = this.state.resolution;
    simulatorData.dpi = this.state.dpi;
    simulatorData.udid = this.state.udid;
    simulatorData.retina = this.state.retina;
    simulatorData.screen_size = this.state.screen_size;
    simulatorData.os = this.state.os.title;
    simulatorData.emulator = this.state.emulator;
    simulatorData.deprecated = false;
    const { errors, isValid } = SimulatorValidation(simulatorData);
    if (isValid) {
      this.props.editSimulator(this.props.match.params.simulatorId, simulatorData, res => {
        if (res.status === 200) {
          successToast("Simulator edited successfully");
          this.props.history.push(`/${this.props.match.params.projectId}/Simulators`);
        } else {
          failToast("Editing simulator failed");
          this.props.history.push(
            `${this.props.match.params.projectId}/EditSimulator${this.props.match.params.simulatorId}`
          );
        }
      });
    } else {
      this.setState({ errors });
    }
  }

  confirmActivation = e => {
    this.props.removeSimulator(this.props.match.params.simulatorId, res => {
      if (res.status === 200) {
        successToast("Simulator removed successfully");
        this.props.history.push(`/${this.props.match.params.projectId}/Simulators`);
      } else {
        failToast("Something went wrong with removing group");
      }
    });
  };
  confirmModal = () => {
    var reject = "No";
    var title = "Remove this simulator?";
    var msg = "Users will not be able to use it on their projects anymore";
    var confirm = "Remove";

    Confirm(title, msg, reject, confirm, e => this.confirmActivation());
  };
  selectOs(value) {
    this.setState({ os: value }, () => {
      this.checkValidation();
    });
  }
  render() {
    var content;
    var { simulator, loading } = this.props.simulators;

    if (isEmpty(simulator) || loading) {
      content = <Spinner />;
    } else {
      content = (
        <div className='main-content--content'>
          <div className='header'>
            <div className='header--title'>Simulator Information </div>
            <div className='header--buttons'>
              <div className='header--buttons--primary'>
                <div className='header--buttons--secondary clickable' onClick={e => this.confirmModal([])}>
                  <i className='fas fa-trash-alt'></i>
                </div>
              </div>
              <div className='header--buttons--secondary'></div>
            </div>
          </div>
          <div>
            <Input
              type='text'
              placeholder='Enter Simulator Title Here'
              label='Title*'
              validationMsg={[this.state.errors.title, this.props.errors.error]}
              value={this.state.title}
              onChange={e => this.onChange(e)}
              name={"title"}
              onKeyDown={this.submitFormOnEnterKey}
            />
            <SearchDropdown
              value={this.state.os}
              options={this.state.mobileOSs}
              onChange={this.selectOs}
              name={"operating_system"}
              label={"Operating System*"}
              validationMsg={[this.state.errors.os, this.props.errors.os]}
              placeholder={"Operating Systems"}
              multiple={false}
            />
            <Input
              type='text'
              placeholder='Enter Simulator Resolution Here'
              label='Resolution'
              validationMsg={this.state.errors.resolution}
              value={this.state.resolution}
              onChange={e => this.onChange(e)}
              name={"resolution"}
              onKeyDown={this.submitFormOnEnterKey}
            />
            <Input
              type='text'
              placeholder='Enter Simulator Screen Size Here'
              label='Screen Size'
              validationMsg={this.state.errors.screen_size}
              value={this.state.screen_size}
              onChange={e => this.onChange(e)}
              name={"screen_size"}
              onKeyDown={this.submitFormOnEnterKey}
            />
            <Input
              type='text'
              placeholder='Enter Simulator dpi Here'
              label='Pixels Per Inch'
              validationMsg={this.state.errors.dpi}
              value={this.state.dpi}
              onChange={e => this.onChange(e)}
              name={"dpi"}
              onKeyDown={this.submitFormOnEnterKey}
            />

            <Switch
              label={"Retina"}
              value={this.state.retina}
              onClick={e => this.setState({ retina: !this.state.retina })}
              name={"retina"}
            />
            <br />
            <Switch
              label={"Emulator"}
              value={this.state.emulator}
              onClick={e => this.setState({ emulator: !this.state.emulator })}
              name={"emulator"}
            />
            <div className='flex-column-left mt-4'>
              <Btn
                className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
                label='Edit Simulator'
                type='text'
                onClick={e => this.submitForm(e)}
              />

              <UnderlineAnchor link={`/${this.props.match.params.projectId}/Simulators`} value={"Cancel"} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className='wrapper'>
        <GlobalPanel props={this.props} />
        <ProjectPanel projectId={this.props.match.params.projectId} />
        <div className='main-content main-content-grid'>
          <Header
            icon={<i className='fas fa-arrow-left'></i>}
            title={"Back To Simulators"}
            history={this.props}
            canGoBack={true}
            link={`/${this.props.match.params.projectId}/Simulators`}
          />

          {content}
        </div>
      </div>
    );
  }
}

EditSimulator.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  simulators: state.simulators,
  offices: state.offices,
  mobileOSs: state.mobileOSs
});

export default connect(mapStateToProps, {
  getSimulator,
  editSimulator,
  getMobileOs,
  removeSimulator,
  getOffices,
  clearErrors
})(withRouter(EditSimulator));
