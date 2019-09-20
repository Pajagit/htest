import axios from "axios";

import { GET_TESTCASE, GET_TESTCASES, TESTCASE_LOADING } from "./types";

// Get All Test Cases
export const getTestcases = project_id => dispatch => {
  dispatch(setTestCaseLoading());

  axios
    .get(`/api/testcases?project_id=${project_id}`)
    .then(res =>
      dispatch({
        type: GET_TESTCASES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_TESTCASES,
        payload: {}
      })
    );
};

// Get Test Case by Test Case id
export const getTestcase = testcaseId => dispatch => {
  dispatch(setTestCaseLoading());

  axios
    .get(`/api/testcases/testcase/${testcaseId}`)
    .then(res =>
      dispatch({
        type: GET_TESTCASE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_TESTCASE,
        payload: {}
      })
    );
};

// Edit Test Case by Test Case id
export const editTestcase = (testcaseId, testCaseData, callback) => dispatch => {
  dispatch(setTestCaseLoading());
  axios
    .put(`/api/testcases/testcase/${testcaseId}`, testCaseData)
    .then(res => callback(res))
    .catch(err => callback(err));
};

// Create Test Case
export const createTestCase = (testCaseData, callback) => dispatch => {
  dispatch(setTestCaseLoading());
  axios
    .post(`/api/testcases/testcase`, testCaseData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_TESTCASE,
        payload: {}
      })
    );
};

// Create Test Case
export const setTestcaseDeprecated = (testcaseId, callback) => dispatch => {
  dispatch(setTestCaseLoading());
  axios
    .put(`/api/testcases/testcase/${testcaseId}/deprecated`)
    .then(res => callback(res))
    .catch(err => callback(err));
};

// Test Case loading
export const setTestCaseLoading = () => {
  return {
    type: TESTCASE_LOADING
  };
};
