import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { createDevice } from "../../../../actions/deviceActions";
import { getOffices } from "../../../../actions/officeActions";
import { superAdminPermissions } from "../../../../permissions/SuperAdminPermissions";
import Input from "../../../../components/common/Input";
import Btn from "../../../../components/common/Btn";
import UnderlineAnchor from "../../../../components/common/UnderlineAnchor";
import DeviceValidation from "../../../../validation/DeviceValidation";
import successToast from "../../../../toast/successToast";
import failToast from "../../../../toast/failToast";
import { clearErrors } from "../../../../actions/errorsActions";

import Switch from "../../../../components/common/Switch";
import GlobalPanel from "../../../../components/global-panel/GlobalPanel";
import SearchDropdown from "../../../../components/common/SearchDropdown";
import SettingPanel from "../../../../components/settings-panel/SettingPanel";
import Header from "../../../../components/common/Header";

class NewDevice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRender: true,
      submitPressed: false,
      offices: this.props.offices.offices,
      officesFormatted: [],
      title: "",
      resolution: "",
      office: null,
      operating_system: [],
      dpi: "",
      screen_size: "",
      udid: "",
      retina: false,
      errors: {}
    };
    this.selectOffice = this.selectOffice.bind(this);
    this.selectOs = this.selectOs.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};

    if (nextProps.auth && nextProps.auth.user) {
      var { isValid } = superAdminPermissions(nextProps.auth.user.projects, nextProps.auth.user.superadmin);
    }

    if (!isValid) {
      nextProps.history.push(`/DeviceSettings`);
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

    return Object.keys(update).length ? update : null;
  }

  componentDidMount() {
    this.props.getOffices();
  }
  selectOffice(value) {
    this.setState({ office: value }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }
  selectOs(value) {
    this.setState({ operating_system: value }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.state.submitPressed) {
        this.checkValidation();
      }
    });
  }

  checkValidation() {
    var deviceData = {};
    deviceData.title = this.state.title;
    deviceData.resolution = this.state.resolution;
    deviceData.dpi = this.state.dpi;
    deviceData.udid = this.state.udid;
    deviceData.retina = this.state.retina;
    deviceData.screen_size = this.state.screen_size;
    deviceData.simulator = false;
    deviceData.office_id = this.state.office ? this.state.office.id : null;

    const { errors } = DeviceValidation(deviceData);
    this.setState({ errors });
  }

  submitForm(e) {
    e.preventDefault();
    this.setState({ submitPressed: true });
    this.props.clearErrors();
    this.setState({ errors: {} });
    var deviceData = {};

    deviceData.title = this.state.title;
    deviceData.resolution = this.state.resolution;
    deviceData.dpi = this.state.dpi;
    deviceData.udid = this.state.udid;
    deviceData.retina = this.state.retina;
    deviceData.screen_size = this.state.screen_size;
    deviceData.simulator = false;
    deviceData.office_id = this.state.office ? this.state.office.id : null;
    deviceData.operating_system = this.state.operating_system.title;
    const { errors, isValid } = DeviceValidation(deviceData);

    if (isValid) {
      this.props.createDevice(deviceData, res => {
        if (res.status === 200) {
          successToast("Device added successfully");
          this.props.history.push(`/DeviceSettings`);
        } else {
          failToast("Adding device failed");
          this.props.history.push(`/AddDevice`);
        }
      });
    } else {
      this.setState({ errors });
    }
  }

  render() {
    var operatingSystems = [
      {
        id: "iOS 13.1.3",
        title: "iOS 13.1.3"
      },
      {
        id: "iOS 13.1.2",
        title: "iOS 13.1.2"
      },
      {
        id: "iOS 13.1.1",
        title: "iOS 13.1.1"
      },
      {
        id: "iOS 13.1.0",
        title: "iOS 13.1.0"
      },
      {
        id: "iOS 13.0.0",
        title: "iOS 13.0.0"
      },
      {
        id: "iOS 12.4.2",
        title: "iOS 12.4.2"
      },
      {
        id: "iOS 12.4.1",
        title: "iOS 12.4.1"
      },
      {
        id: "iOS 12.4.0",
        title: "iOS 12.4.0"
      },
      {
        id: "iOS 12.3.2",
        title: "iOS 12.3.2"
      },
      {
        id: "iOS 12.3.1",
        title: "iOS 12.3.1"
      },
      {
        id: "iOS 12.3.0",
        title: "iOS 12.3.0"
      },
      {
        id: "iOS 12.2.0",
        title: "iOS 12.2.0"
      },
      {
        id: "iOS 12.1.4",
        title: "iOS 12.1.4"
      },
      {
        id: "iOS 12.1.3",
        title: "iOS 12.1.3"
      },
      {
        id: "iOS 12.1.2",
        title: "iOS 12.1.2"
      },
      {
        id: "iOS 12.1.1",
        title: "iOS 12.1.1"
      },
      {
        id: "iOS 12.1.0",
        title: "iOS 12.1.0"
      },
      {
        id: "iOS 12.0.1",
        title: "iOS 12.0.1"
      },
      {
        id: "iOS 12.0.0",
        title: "iOS 12.0.0"
      },
      {
        id: "iOS 11.4.1",
        title: "iOS 11.4.1"
      },
      {
        id: "iOS 11.4.0",
        title: "iOS 11.4.0"
      },
      {
        id: "iOS 11.3.1",
        title: "iOS 11.3.1"
      },
      {
        id: "iOS 11.3.0",
        title: "iOS 11.3.0"
      },
      {
        id: "iOS 11.2.6",
        title: "iOS 11.2.6"
      },
      {
        id: "iOS 11.2.5",
        title: "iOS 11.2.5"
      },
      {
        id: "iOS 11.2.4",
        title: "iOS 11.2.4"
      },
      {
        id: "iOS 11.2.3",
        title: "iOS 11.2.3"
      },
      {
        id: "iOS 11.2.2",
        title: "iOS 11.2.2"
      },
      {
        id: "iOS 11.2.1",
        title: "iOS 11.2.1"
      },
      {
        id: "iOS 11.2.0",
        title: "iOS 11.2.0"
      },
      {
        id: "iOS 11.1.2",
        title: "iOS 11.1.2"
      },
      {
        id: "iOS 11.1.1",
        title: "iOS 11.1.1"
      },
      {
        id: "iOS 11.1.0",
        title: "iOS 11.1.0"
      },
      {
        id: "iOS 11.0.3",
        title: "iOS 11.0.3"
      },
      {
        id: "iOS 11.0.2",
        title: "iOS 11.0.2"
      },
      {
        id: "iOS 11.0.1",
        title: "iOS 11.0.1"
      },
      {
        id: "iOS 11.0.0",
        title: "iOS 11.0.0"
      },
      {
        id: "iOS 10.3.4",
        title: "iOS 10.3.4"
      },
      {
        id: "iOS 10.3.3",
        title: "iOS 10.3.3"
      },
      {
        id: "iOS 10.3.2",
        title: "iOS 10.3.2"
      },
      {
        id: "iOS 10.3.1",
        title: "iOS 10.3.1"
      },
      {
        id: "iOS 10.3.0",
        title: "iOS 10.3.0"
      },
      {
        id: "iOS 10.2.1",
        title: "iOS 10.2.1"
      },
      {
        id: "iOS 10.2.0",
        title: "iOS 10.2.0"
      },
      {
        id: "iOS 10.1.1",
        title: "iOS 10.1.1"
      },
      {
        id: "iOS 10.1.0",
        title: "iOS 10.1.0"
      },
      {
        id: "iOS 10.0.3",
        title: "iOS 10.0.3"
      },
      {
        id: "iOS 10.0.2",
        title: "iOS 10.0.2"
      },
      {
        id: "iOS 10.0.1",
        title: "iOS 10.0.1"
      },
      {
        id: "iOS 10.0.0",
        title: "iOS 10.0.0"
      },
      {
        id: "iOS 9.3.6",
        title: "iOS 9.3.6"
      },
      {
        id: "iOS 9.3.5",
        title: "iOS 9.3.5"
      },
      {
        id: "iOS 9.3.4",
        title: "iOS 9.3.4"
      },
      {
        id: "iOS 9.3.3",
        title: "iOS 9.3.3"
      },
      {
        id: "iOS 9.3.2",
        title: "iOS 9.3.2"
      },
      {
        id: "iOS 9.3.1",
        title: "iOS 9.3.1"
      },
      {
        id: "iOS 9.3.0",
        title: "iOS 9.3.0"
      },
      {
        id: "iOS 9.2.1",
        title: "iOS 9.2.1"
      },
      {
        id: "iOS 9.2.0",
        title: "iOS 9.2.0"
      },
      {
        id: "iOS 9.1.0",
        title: "iOS 9.1.0"
      },
      {
        id: "iOS 9.0.2",
        title: "iOS 9.0.2"
      },
      {
        id: "iOS 9.0.1",
        title: "iOS 9.0.1"
      },
      {
        id: "iOS 9.0.0",
        title: "iOS 9.0.0"
      },
      {
        id: "iOS 8.4.1",
        title: "iOS 8.4.1"
      },
      {
        id: "iOS 8.4.0",
        title: "iOS 8.4.0"
      },
      {
        id: "iOS 8.3.0",
        title: "iOS 8.3.0"
      },
      {
        id: "iOS 8.2.0",
        title: "iOS 8.2.0"
      },
      {
        id: "iOS 8.1.3",
        title: "iOS 8.1.3"
      },
      {
        id: "iOS 8.1.2",
        title: "iOS 8.1.2"
      },
      {
        id: "iOS 8.1.1",
        title: "iOS 8.1.1"
      },
      {
        id: "iOS 8.1.0",
        title: "iOS 8.1.0"
      },

      {
        id: "iOS 8.0.2",
        title: "iOS 8.0.2"
      },
      {
        id: "iOS 8.0.1",
        title: "iOS 8.0.1"
      },
      {
        id: "iOS 8.0.0",
        title: "iOS 8.0.0"
      },
      {
        id: "iOS 7.1.2",
        title: "iOS 7.1.2"
      },
      {
        id: "iOS 7.1.1",
        title: "iOS 7.1.1"
      },
      {
        id: "iOS 7.1.0",
        title: "iOS 7.1.0"
      },
      {
        id: "iOS 7.0.6",
        title: "iOS 7.0.6"
      },
      {
        id: "iOS 7.0.5",
        title: "iOS 7.0.5"
      },
      {
        id: "iOS 7.0.4",
        title: "iOS 7.0.4"
      },
      {
        id: "iOS 7.0.3",
        title: "iOS 7.0.3"
      },
      {
        id: "iOS 7.0.2",
        title: "iOS 7.0.2"
      },
      {
        id: "iOS 7.0.1",
        title: "iOS 7.0.1"
      },
      {
        id: "iOS 7.0.0",
        title: "iOS 7.0.0"
      },
      {
        id: "iOS 6.1.5",
        title: "iOS 6.1.5"
      },
      {
        id: "iOS 6.1.4",
        title: "iOS 6.1.4"
      },
      {
        id: "iOS 6.1.3",
        title: "iOS 6.1.3"
      },
      {
        id: "iOS 6.1.2",
        title: "iOS 6.1.2"
      },
      {
        id: "iOS 6.1.1",
        title: "iOS 6.1.1"
      },
      {
        id: "iOS 6.1.0",
        title: "iOS 6.1.0"
      },
      {
        id: "iOS 6.0.2",
        title: "iOS 6.0.2"
      },
      {
        id: "iOS 6.0.1",
        title: "iOS 6.0.1"
      },
      {
        id: "iOS 6.0.0",
        title: "iOS 6.0.0"
      },
      {
        id: "iOS 5.1.1",
        title: "iOS 5.1.1"
      },
      {
        id: "iOS 5.1.0",
        title: "iOS 5.1.0"
      },
      {
        id: "iOS 5.0.1",
        title: "iOS 5.0.1"
      },
      {
        id: "iOS 5.0.0",
        title: "iOS 5.0.0"
      },
      {
        id: "iOS 4.3.5",
        title: "iOS 4.3.5"
      },
      {
        id: "iOS 4.3.4",
        title: "iOS 4.3.4"
      },
      {
        id: "iOS 4.3.3",
        title: "iOS 4.3.3"
      },
      {
        id: "iOS 4.3.2",
        title: "iOS 4.3.2"
      },
      {
        id: "iOS 4.3.1",
        title: "iOS 4.3.1"
      },
      {
        id: "iOS 4.3.0",
        title: "iOS 4.3.0"
      },
      {
        id: "iOS 4.2.9",
        title: "iOS 4.2.9"
      },
      {
        id: "iOS 4.2.8",
        title: "iOS 4.2.8"
      },
      {
        id: "iOS 4.2.7",
        title: "iOS 4.2.7"
      },
      {
        id: "iOS 4.2.6",
        title: "iOS 4.2.6"
      },
      {
        id: "iOS 4.2.5",
        title: "iOS 4.2.5"
      },
      {
        id: "iOS 4.2.10",
        title: "iOS 4.2.10"
      },
      {
        id: "iOS 4.2.1",
        title: "iOS 4.2.1"
      },
      {
        id: "iOS 4.1.0",
        title: "iOS 4.1.0"
      },
      {
        id: "iOS 4.0.2",
        title: "iOS 4.0.2"
      },
      {
        id: "iOS 4.0.1",
        title: "iOS 4.0.1"
      },
      {
        id: "iOS 4.0.0",
        title: "iOS 4.0.0"
      },
      { id: "Android 10.0.0", title: "Android 10.0.0" },
      { id: "Pie 9.0.0", title: "Pie 9.0.0" },
      { id: "Oreo 8.1.0", title: "Oreo 8.1.0" },
      { id: "Oreo 8.0.0", title: "Oreo 8.0.0" },
      { id: "Nougat 7.1.2", title: "Nougat 7.1.2" },
      { id: "Nougat 7.1.1", title: "Nougat 7.1.1" },
      { id: "Nougat 7.1.0", title: "Nougat 7.1.0" },
      { id: "Nougat 7.0.0", title: "Nougat 7.0.0" },
      { id: "Marshmallow 6.0.1", title: "Marshmallow 6.0.1" },
      { id: "Marshmallow 6.0.0", title: "Marshmallow 6.0.0" },
      { id: "Lollipop 5.1.1", title: "Lollipop 5.1.1" },
      { id: "Lollipop 5.1.0", title: "Lollipop 5.1.0" },
      { id: "Lollipop 5.0.2", title: "Lollipop 5.0.2" },
      { id: "Lollipop 5.0.1", title: "Lollipop 5.0.1" },
      { id: "Lollipop 5.0.0", title: "Lollipop 5.0.0" },
      { id: "KitKat 4.4.4", title: "KitKat 4.4.4" },
      { id: "KitKat 4.4.3", title: "KitKat 4.4.3" },
      { id: "KitKat 4.4.2", title: "KitKat 4.4.2" },
      { id: "KitKat 4.4.1", title: "KitKat 4.4.1" },
      { id: "KitKat 4.4.0", title: "KitKat 4.4.0" },
      { id: "Jelly Bean 4.3.1", title: "Jelly Bean 4.3.1" },
      { id: "Jelly Bean 4.3.0", title: "Jelly Bean 4.3.0" },
      { id: "Jelly Bean 4.2.2", title: "Jelly Bean 4.2.2" },
      { id: "Jelly Bean 4.2.1", title: "Jelly Bean 4.2.1" },
      { id: "Jelly Bean 4.2.0", title: "Jelly Bean 4.2.0" },
      { id: "Jelly Bean 4.1.2", title: "Jelly Bean 4.1.2" },
      { id: "Jelly Bean 4.1.1", title: "Jelly Bean 4.1.1" },
      { id: "Jelly Bean 4.1.0", title: "Jelly Bean 4.1.0" },
      { id: "Ice Cream Sandwitch 4.0.4", title: "Ice Cream Sandwitch 4.0.4" },
      { id: "Ice Cream Sandwitch 4.0.3", title: "Ice Cream Sandwitch 4.0.3" },
      { id: "Ice Cream Sandwitch 4.0.2", title: "Ice Cream Sandwitch 4.0.2" },
      { id: "Ice Cream Sandwitch 4.0.1", title: "Ice Cream Sandwitch 4.0.1" },
      { id: "Ice Cream Sandwitch 4.0.0", title: "Ice Cream Sandwitch 4.0.0" }
    ];
    return (
      <div className="wrapper">
        <GlobalPanel props={this.props} />
        <SettingPanel props={this.props} />
        <div className="main-content main-content-grid">
          <Header
            icon={<i className="fas fa-arrow-left"></i>}
            title={"Back To Device Settings"}
            history={this.props}
            canGoBack={true}
            link={`/DeviceSettings`}
          />
          <div className="main-content--content">
            <div className="header">
              <div className="header--title">Device Information </div>
              <div className="header--buttons">
                <div className="header--buttons--primary"></div>
                <div className="header--buttons--secondary"></div>
              </div>
            </div>
            <div>
              <Input
                type="text"
                placeholder="Enter Device Title Here"
                label="Title*"
                validationMsg={[this.state.errors.title, this.props.errors.error]}
                value={this.state.title}
                onChange={e => this.onChange(e)}
                name={"title"}
                onKeyDown={this.submitFormOnEnterKey}
              />
              <SearchDropdown
                value={this.state.office}
                options={this.state.officesFormatted}
                onChange={this.selectOffice}
                name={"office_id"}
                label={"Office*"}
                validationMsg={this.state.errors.office_id}
                placeholder={"Offices"}
                multiple={false}
              />
              <SearchDropdown
                value={this.state.operating_system}
                options={operatingSystems}
                onChange={this.selectOs}
                name={"operating_system"}
                label={"Operating System*"}
                placeholder={"Operating Systems"}
                multiple={false}
              />
              <Input
                type="text"
                placeholder="Enter Device Resolution Here"
                label="Resolution"
                validationMsg={this.state.errors.resolution}
                value={this.state.resolution}
                onChange={e => this.onChange(e)}
                name={"resolution"}
                onKeyDown={this.submitFormOnEnterKey}
              />
              <Input
                type="text"
                placeholder="Enter Device Screen Size Here"
                label="Screen Size"
                validationMsg={this.state.errors.screen_size}
                value={this.state.screen_size}
                onChange={e => this.onChange(e)}
                name={"screen_size"}
                onKeyDown={this.submitFormOnEnterKey}
              />
              <Input
                type="text"
                placeholder="Enter Device dpi Here"
                label="Pixels Per Inch"
                validationMsg={this.state.errors.dpi}
                value={this.state.dpi}
                onChange={e => this.onChange(e)}
                name={"dpi"}
                onKeyDown={this.submitFormOnEnterKey}
              />
              <Input
                type="text"
                placeholder="Enter Device Udid Here"
                label="Unique Device Identifier"
                validationMsg={this.state.errors.udid}
                value={this.state.udid}
                onChange={e => this.onChange(e)}
                name={"udid"}
                onKeyDown={this.submitFormOnEnterKey}
              />

              <Switch
                label={"Retina"}
                value={this.state.retina}
                onClick={e => this.setState({ retina: !this.state.retina })}
                name={"retina"}
              />
              <div className="flex-column-left mt-4">
                <Btn
                  className={`btn btn-primary ${this.state.submitBtnDisabledClass} mr-2`}
                  label="Add Device"
                  type="text"
                  onClick={e => this.submitForm(e)}
                />

                <UnderlineAnchor link={`/DeviceSettings`} value={"Cancel"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NewDevice.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  devices: state.devices,
  offices: state.offices
});

export default connect(
  mapStateToProps,
  { createDevice, getOffices, clearErrors }
)(withRouter(NewDevice));
