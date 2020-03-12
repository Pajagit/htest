import axios from "axios";

import { GET_REPORT_FILTERS } from "./types";

// Get Selected Filters For Reports
export const getReportFilters = project_id => dispatch => {
  axios
    .get(`/api/projects/project/${project_id}/report-filters`)
    .then(res => {
      dispatch({
        type: GET_REPORT_FILTERS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_REPORT_FILTERS,
        payload: {}
      })
    );
};
