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
export const editTestcase = (testcaseId, testCaseData, history) => dispatch => {
  axios
    .put(`/api/testcases/testcase/${testcaseId}`, testCaseData)
    .then(res => history.push(`/TestCase/${testcaseId}`))
    .catch(err =>
      dispatch({
        type: GET_TESTCASE,
        payload: {}
      })
    );
};
