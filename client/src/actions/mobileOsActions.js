import axios from "axios";

import { GET_MOBILE_OS } from "./types";

// Get All Mobile OSs
export const getMobileOs = () => dispatch => {
  axios
    .get(`/api/mobileoperatingsystems`)
    .then(res =>
      dispatch({
        type: GET_MOBILE_OS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_MOBILE_OS,
        payload: {}
      })
    );
};
