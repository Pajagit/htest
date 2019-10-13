import axios from "axios";

import { GET_SETTINGS } from "./types";

// Get User Settings
export const getUserSettings = user_id => dispatch => {
  axios
    .get(`/api/users/user/${user_id}/settings`)
    .then(res =>
      dispatch({
        type: GET_SETTINGS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_SETTINGS,
        payload: {}
      })
    );
};

// Get User Settings
export const editUserSettings = (user_id, settingsData, callback) => dispatch => {
  axios
    .put(`/api/users/user/${user_id}/settings`, settingsData)
    .then(res => {
      callback(res);
      dispatch({
        type: GET_SETTINGS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_SETTINGS,
        payload: {}
      })
    );
};
