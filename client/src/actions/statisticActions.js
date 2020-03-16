import axios from "axios";

import { GET_PROJECT_STATISTICS, STATISTICS_LOADING } from "./types";

// Get Project Statistics
export const getProjectStatistics = () => dispatch => {
  dispatch(statisticsLoading());
  axios
    // .get("https://api.myjson.com/bins/uhvtm") // annual test
    .get("https://api.myjson.com/bins/18wknu") // most used TC test
    // .get("https://api.myjson.com/bins/w81h6") // nema ni jedan
    // .get("https://api.myjson.com/bins/m1j16") // ima po neki
    // .get(`https://api.myjson.com/bins/1citmm`) // ima sve
    // .get(`https://api.myjson.com/bins/1afdku`)

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
