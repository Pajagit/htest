import axios from "axios";

import { GET_USER, GET_USERS, GET_ERRORS } from "./types";

// Get All Users
export const getUsers = () => dispatch => {
  axios
    .get(`/api/users`)
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
