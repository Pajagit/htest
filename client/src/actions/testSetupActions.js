import axios from "axios";

import { GET_TEST_SETUP, TEST_SETUP_LOADING, GET_ERRORS } from "./types";

// Get All Test setup items
export const getTestSetup = project_id => dispatch => {
  dispatch(testSetupLoading());

  axios
    .get(`/api/testsetup?&project_id=${project_id}`)
    .then(res =>
      dispatch({
        type: GET_TEST_SETUP,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_TEST_SETUP,
        payload: {}
      })
    );
};

// Change is used for Test setup item
export const usedTestSetup = (project_id, testsetupitem_id, is_used, callback) => dispatch => {
  axios
    .put(`/api/testsetup?project_id=${project_id}&testsetupitem_id=${testsetupitem_id}&used=${is_used}`)
    .then(res => callback(res))
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      callback(err.response.data);
    });
};

// Test setup loading
export const testSetupLoading = () => {
  return {
    type: TEST_SETUP_LOADING
  };
};
