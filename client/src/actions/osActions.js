import axios from "axios";

import { GET_OSS, GET_OS, OS_LOADING, GET_ERRORS } from "./types";

// Get All Operating Systems
export const getOperatingSystems = (project_id, pageSent, pageSizeSent) => dispatch => {
  //   dispatch(browserLoading());
  var page = pageSent === undefined ? 1 : pageSent;
  var size = pageSizeSent === undefined ? 100 : pageSizeSent;

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
