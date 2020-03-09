import axios from "axios";

import { GET_TESTCASE_SETUP } from "./types";

// Get Test Case Setup
export const getTestcaseSetup = testcase_id => dispatch => {
  axios
    .get(`/api/testcases/testcase/${testcase_id}/setup`)
    .then(res => {
      dispatch({
        type: GET_TESTCASE_SETUP,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_TESTCASE_SETUP,
        payload: {}
      })
    );
};
