import axios from "axios";

import { GET_PROJECT_SETTINGS, SETTINGS_LOADING, CLEAR_SETTINGS } from "./types";

// Get User Settings
export const getProjectSettings = project_id => dispatch => {
  dispatch(setSettingsLoading());
  axios
    .get(`/api/projects/project/${project_id}/settings`)
    .then(res => {
      dispatch({
        type: GET_PROJECT_SETTINGS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_PROJECT_SETTINGS,
        payload: {}
      })
    );
};

// Get User Settings
export const editProjectSettings = (project_id, settingsData) => dispatch => {
  axios
    .put(`/api/projects/project/${project_id}/settings`, settingsData)
    .then(res => {
      dispatch({
        type: GET_PROJECT_SETTINGS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_PROJECT_SETTINGS,
        payload: {}
      })
    );
};

// Settings loading
export const setSettingsLoading = () => {
  return {
    type: SETTINGS_LOADING
  };
};

export const clearSettings = () => dispatch => {
  dispatch({
    type: CLEAR_SETTINGS,
    payload: {}
  });
};
