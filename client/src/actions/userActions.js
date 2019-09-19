import axios from "axios";

import { GET_USER, GET_USERS } from "./types";

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
