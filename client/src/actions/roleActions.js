import axios from "axios";

import { GET_ROLE, GET_ROLES, ROLE_LOADING } from "./types";

// Get All Roles
export const getRoles = () => dispatch => {
  dispatch(roleLoading());
  axios
    .get("/api/roles")
    .then(res =>
      dispatch({
        type: GET_ROLES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ROLES,
        payload: {}
      })
    );
};

// Get  Role by role_id
export const getRole = role_id => dispatch => {
  dispatch(roleLoading());
  axios
    .get(`/api/roles/role/${role_id}`)
    .then(res =>
      dispatch({
        type: GET_ROLE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ROLE,
        payload: {}
      })
    );
};

// Role loading
export const roleLoading = () => {
  return {
    type: ROLE_LOADING
  };
};
