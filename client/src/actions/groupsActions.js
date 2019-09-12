import axios from "axios";

import { GET_GROUPS } from "./types";

// Get All Groups
export const getGroups = callback => dispatch => {
  axios
    .get(`http://www.json-generator.com/api/json/get/cekggErVbC?indent=2`)
    .then(res =>
      dispatch({
        type: GET_GROUPS,
        payload: res.data
      })
    )
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_GROUPS,
        payload: {}
      })
    );
};
