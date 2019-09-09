import axios from "axios";

import { GET_GROUPS } from "./types";

// Get All Groups
export const getGroups = () => dispatch => {
  axios
    .get(`http://www.json-generator.com/api/json/get/cfseplVjpK?indent=2`)
    .then(res =>
      dispatch({
        type: GET_GROUPS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_GROUPS,
        payload: {}
      })
    );
};
