// import React, { Component } from "react";
// import SearchDropdown from "../common/SearchDropdown";
// import Datepicker from "../common/Datepicker";
// import isEmpty from "../../validation/isEmpty";
// import Tag from "../common/Tag";
// import moment from "moment";
// import { getGroups } from "../../actions/groupsActions";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { withRouter } from "react-router-dom";

// class FilterContainer extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       options: "",
//       value: null,
//       arrayValue: [],
//       users: [],
//       showDatepickerFrom: false,
//       selectedDateFrom: "",
//       selectedDateTimestampFrom: "",
//       activeDateFrom: "",
//       showDatepickerTo: false,
//       selectedDateTo: "",
//       selectedDateTimestampTo: "",
//       activeDateTo: "",

//       groupFilters: []
//     };
//     this.selectMultipleOptionGroups = this.selectMultipleOptionGroups.bind(this);
//     this.selectMultipleOptionUsers = this.selectMultipleOptionUsers.bind(this);
//   }

//   componentDidMount() {
//     document.addEventListener("mousedown", this.handleClick, false);
//     var projectId = this.props.match.params.projectId;
//     this.props.getGroups(projectId);
//   }

//   componentWillUnmount() {
//     document.removeEventListener("mousedown", this.handleClick, false);
//   }

//   // handleClick = e => {
//   //   if (this.node.contains(e.target)) {
//   //     return;
//   //   }
//   //   if (this.node2.contains(e.target)) {
//   //     return;
//   //   }
//   //   this.handleClickOutside();
//   // };

//   handleClickOutside() {
//     this.setState({ showDatepickerFrom: false, showDatepickerTo: false });
//   }

//   selectMultipleOptionUsers(value) {
//     this.setState({ users: value });
//   }

//   selectMultipleOptionGroups(value) {
//     this.setState({ groupFilters: value });
//   }
//   removeFromDate() {
//     this.setState({ selectedDateFrom: "", selectedDateTimestampFrom: "" });
//   }
//   removeGroup(e) {
//     var groups = this.state.groupFilters.filter(function(item) {
//       return item["id"] !== e;
//     });
//     this.setState({ groupFilters: groups });
//   }
//   removeUser(e) {
//     var users = this.state.users.filter(function(item) {
//       return item["id"] !== e;
//     });
//     this.setState({ users });
//   }
//   removeToDate() {
//     this.setState({ selectedDateTo: "", selectedDateTimestampTo: "" });
//   }
//   render() {
//     var allGroups = [];
//     if (this.props.groups && this.props.groups.groups) {
//       allGroups = this.props.groups.groups;
//     }

//     var usersList = [];
//     usersList.push(
//       { id: 1, name: "Aleksandar Pavlovic", color: "KEPPEL" },
//       { id: 2, name: "Jana Antic", color: "DARK_KHAKI" },
//       { id: 3, name: "Milos Najdanovic", color: "LIBERTY" }
//     );

//     var fromDate = "";
//     if (!isEmpty(this.state.selectedDateFrom)) {
//       fromDate = (
//         <Tag
//           title={`From: ${this.state.selectedDateFrom}`}
//           color={"DATE_COLOR"}
//           isRemovable={true}
//           onClickRemove={e => this.removeFromDate(e)}
//         />
//       );
//     }
//     var toDate = "";
//     if (!isEmpty(this.state.selectedDateTo)) {
//       toDate = (
//         <Tag
//           title={`To: ${this.state.selectedDateTo}`}
//           color={"DATE_COLOR"}
//           isRemovable={true}
//           onClickRemove={e => this.removeToDate(e)}
//         />
//       );
//     }
//     return (
//       <div>
//         {/* <div className="testcase-grid">
//           <SearchDropdown
//             value={this.state.groupFilters}
//             options={allGroups}
//             onChange={this.selectMultipleOptionGroups}
//             label={"Test Groups"}
//             placeholder={"Groups"}
//             multiple={true}
//           />

//           <SearchDropdown
//             value={this.state.users}
//             options={usersList}
//             onChange={this.selectMultipleOptionUsers}
//             label={"Select User"}
//             placeholder={"Users"}
//             multiple={true}
//             numberDisplayed={2}
//           />

//           <Datepicker
//             forwardRef={node => (this.node = node)}
//             showdatepicker={this.state.showDatepickerFrom}
//             placeholder={"From Date"}
//             label={"Select Date"}
//             selectedDate={this.state.selectedDateFrom}
//             onClick={e => this.setState({ showDatepickerFrom: !this.state.showDatepickerFrom })}
//             onChange={e => this.setState({ showDatepickerFrom: !this.state.showDatepickerFrom })}
//             active={this.state.activeDateFrom ? this.state.activeDateFrom !== null : ""}
//             timestamp={this.state.selectedDateTimestampFrom}
//             onDayClick={day => {
//               this.setState({ selectedDateFrom: moment(day).format(" Do MMM YY") });
//               this.setState({ selectedDateTimestampFrom: day });
//               this.setState({ showDatepickerFrom: false });
//             }}
//           />
//           <Datepicker
//             forwardRef={node2 => (this.node2 = node2)}
//             showdatepicker={this.state.showDatepickerTo}
//             placeholder={"To Date"}
//             label={"Select Date"}
//             selectedDate={this.state.selectedDateTo}
//             onClick={e => this.setState({ showDatepickerTo: !this.state.showDatepickerTo })}
//             onChange={e => this.setState({ showDatepickerTo: !this.state.showDatepickerTo })}
//             active={this.state.activeDateTo ? this.state.activeDateTo !== null : ""}
//             timestamp={this.state.selectedDateTimestampTo}
//             onDayClick={day => {
//               this.setState({ selectedDateTo: moment(day).format(" Do MMM YY") });
//               this.setState({ selectedDateTimestampTo: day });
//               this.setState({ showDatepickerTo: false });
//             }}
//           />
//         </div>

//         <div className="active-filter-container">
//           {this.state.groupFilters.map((group, index) => (
//             <Tag
//               key={index}
//               title={group.name}
//               color={group.color}
//               isRemovable={true}
//               onClickRemove={e => this.removeGroup(group.id)}
//             />
//           ))}
//           {this.state.users.map((user, index) => (
//             <Tag
//               key={index}
//               title={user.name}
//               color={"USER_COLOR"}
//               isRemovable={true}
//               onClickRemove={e => this.removeUser(user.id)}
//             />
//           ))}
//           {fromDate}
//           {toDate}
//         </div> */}
//       </div>
//     );
//   }
// }
// FilterContainer.propTypes = {
//   testcases: PropTypes.object.isRequired,
//   groups: PropTypes.object.isRequired
// };

// const mapStateToProps = state => ({
//   testcases: state.testcases,
//   groups: state.groups
//   // auth: state.auth,
// });

// export default connect(
//   mapStateToProps,
//   { getGroups }
// )(withRouter(FilterContainer));
