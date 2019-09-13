import axios from "axios";

import { GET_GROUPS } from "./types";

// Get All Groups
export const getGroups = project_id => dispatch => {
  axios
    .get(`/api/groups?project_id=${project_id}`)
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
