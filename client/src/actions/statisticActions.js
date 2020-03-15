import axios from "axios";

import { GET_PROJECT_STATISTICS, STATISTICS_LOADING } from "./types";

// Get Project Statistics
export const getProjectStatistics = () => dispatch => {
  dispatch(statisticsLoading());
  axios
    // .get(`https://api.myjson.com/bins/1citmm`)
    .get(`https://api.myjson.com/bins/1afdku`)

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

// Statistics loading
export const statisticsLoading = () => {
  return {
    type: STATISTICS_LOADING
  };
};
