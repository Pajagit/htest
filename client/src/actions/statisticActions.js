import axios from "axios";

import { GET_PROJECT_STATISTICS, STATISTICS_LOADING, GET_GLOBAL_STATISTICS } from "./types";

// Get Project Statistics
export const getProjectStatistics = (projectId, params) => dispatch => {
  dispatch(statisticsLoading());
  var url = `/api/projects/project/${projectId}/statistics`;
  if (params && typeof params === "number") {
    url = `/api/projects/project/${projectId}/statistics?days=${params}`;
  } else if (params && typeof params === "string") {
    url = `/api/projects/project/${projectId}/statistics?option=${params}`;
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
export const getGlobalStatistics = params => dispatch => {
  dispatch(statisticsLoading());
  var url = "/api/statistics";
  if (params && typeof params === "number") {
    url = `/api/statistics?days=${params}`;
  } else if (params && typeof params === "string") {
    url = `/api/statistics?option=${params}`;
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
