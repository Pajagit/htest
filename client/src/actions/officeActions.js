import axios from "axios";

import { GET_OFFICES } from "./types";

// Get All Offices
export const getOffices = () => dispatch => {
  axios
    .get(`/api/offices`)
    .then(res =>
      dispatch({
        type: GET_OFFICES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_OFFICES,
        payload: {}
      })
    );
};
