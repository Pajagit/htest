import axios from "axios";

import { GET_PROJECT_STATISTICS, STATISTICS_LOADING, GET_GLOBAL_STATISTICS } from "./types";

// Get Project Statistics
export const getProjectStatistics = (projectId, days) => dispatch => {
  dispatch(statisticsLoading());
  var url = `/api/projects/project/${projectId}/statistics`;
  if (days) {
    url = `/api/projects/project/${projectId}/statistics?days=${days}`;
  }
  axios
    .get(url)
    .then(res =>
      dispatch({
        type: GET_PROJECT_STATISTICS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROJECT_STATISTICS,
        payload: {}
      })
    );
};

// Get Project Statistics
export const getGlobalStatistics = days => dispatch => {
  dispatch(statisticsLoading());
  var url = "/api/statistics";
  if (days) {
    url = `/api/statistics?days=${days}`;
  }
  axios
    .get(url)
    .then(res =>
      dispatch({
        type: GET_GLOBAL_STATISTICS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_GLOBAL_STATISTICS,
        payload: {}
      })
    );
};

// Statistics loading
export const statisticsLoading = () => {
  return {
    type: STATISTICS_LOADING
  };
};
