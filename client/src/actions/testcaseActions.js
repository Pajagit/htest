import axios from "axios";

import { GET_TESTCASES } from "./types";

// Get All Test Cases
export const getTestcases = () => dispatch => {
  axios
    .get(`http://www.json-generator.com/api/json/get/bUlKWaETJu?indent=2`)
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
