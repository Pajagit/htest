import axios from "axios";

import { GET_OSS } from "./types";

// Get All Operating Systems
export const getOperatingSystems = () => dispatch => {
  axios
    .get(`/api/operatingsystems`)
    .then(res =>
      dispatch({
        type: GET_OSS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_OSS,
        payload: {}
      })
    );
};
