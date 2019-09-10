import axios from "axios";

import { GET_TESTCASE, GET_TESTCASES } from "./types";

// Get All Test Cases
export const getTestcases = () => dispatch => {
  axios
    .get(`http://www.json-generator.com/api/json/get/cetTolnlwy?indent=2`)
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
export const editTestcase = (testcaseId, projectId, testCaseData, history) => dispatch => {
  axios
    .put(`/api/testcases/testcase/${testcaseId}`, testCaseData)
    .then(res => history.push(`/${projectId}/TestCase/${testcaseId}`))
    .catch(err =>
      dispatch({
        type: GET_TESTCASE,
        payload: {}
      })
    );
};

// Create Test Case
export const createTestCase = (testCaseData, history) => dispatch => {
  axios
    .post(`/api/testcases/testcase`, testCaseData)
    .then(res => history.push(`/${testCaseData.project_id}/TestCase/${res.data.id}`))
    .catch(err =>
      dispatch({
        type: GET_TESTCASE,
        payload: {}
      })
    );
};
