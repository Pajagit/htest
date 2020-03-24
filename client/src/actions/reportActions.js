import axios from "axios";
import isEmpty from "../validation/isEmpty";

import { GET_REPORTS, GET_REPORT, REPORT_LOADING, GET_ERRORS, CLEAR_REPORT } from "./types";

// Get All Reports
export const getReports = (project_id, reportFilters, page) => dispatch => {
  dispatch(reportLoading());
  if (isEmpty(page)) {
    page = 1;
  }
  var page_size = 30;

  axios
    .post(`/api/reports?page=${page}&page_size=${page_size}&project_id=${project_id}`, reportFilters)
    .then(res =>
      dispatch({
        type: GET_REPORTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_REPORTS,
        payload: {}
      })
    );
};

// Get Report by report_id
export const getReport = report_id => dispatch => {
  dispatch(reportLoading());
  axios
    .get(`/api/reports/report/${report_id}`)
    .then(res =>
      dispatch({
        type: GET_REPORT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_REPORT,
        payload: {}
      })
    );
};

// Create Report
export const createReport = (reportData, callback) => dispatch => {
  dispatch(reportLoading());
  axios
    .post(`/api/reports/report`, reportData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// // Edit Report by report_id
// export const editReport = (report_id, reportData, callback) => dispatch => {
//   dispatch(reportLoading());
//   axios
//     .put(`/api/reports/report/${report_id}`, reportData)
//     .then(res => callback(res))
//     .catch(err =>
//       dispatch({
//         type: GET_ERRORS,
//         payload: err.response.data
//       })
//     );
// };

// Report loading
export const reportLoading = () => {
  return {
    type: REPORT_LOADING
  };
};

// Clear Report
export const clearReport = () => {
  return {
    type: CLEAR_REPORT
  };
};
