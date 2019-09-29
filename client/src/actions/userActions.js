import axios from "axios";

import { GET_USER, GET_USERS, USER_LOADING, GET_ERRORS } from "./types";

// Get All Users
export const getUsers = has_testcases => dispatch => {
  dispatch(userLoading());
  var url = "/api/users";
  if (has_testcases) {
    url = `/api/users?has_testcases=${has_testcases}`;
  }
  axios
    .get(url)
    .then(res =>
      dispatch({
        type: GET_USERS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_USERS,
        payload: {}
      })
    );
};

// Get  User by user_id
export const getUser = user_id => dispatch => {
  dispatch(userLoading());
  axios
    .get(`/api/users/user/${user_id}`)
    .then(res =>
      dispatch({
        type: GET_USER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_USER,
        payload: {}
      })
    );
};

// Edit  User by user_id
export const editUser = (user_id, userData, callback) => dispatch => {
  axios
    .put(`/api/users/user/${user_id}`, userData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Create Project
export const addUser = (userData, callback) => dispatch => {
  axios
    .post("/api/users/user", userData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// User Activation/Deactivation
export const userActivation = (user_id, userData, callback) => dispatch => {
  axios
    .put(`/api/users/user/${user_id}/activation`, userData)
    .then(res => callback(res))
    .catch(err => callback(err));
};

// User loading
export const userLoading = () => {
  return {
    type: USER_LOADING
  };
};
