import axios from "axios";

import { GET_STATUSES } from "./types";

// Get All Statuses
export const getStatuses = () => dispatch => {
  axios
    .get(`/api/reports/statuses`)
    .then(res =>
      dispatch({
        type: GET_STATUSES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_STATUSES,
        payload: {}
      })
    );
};
