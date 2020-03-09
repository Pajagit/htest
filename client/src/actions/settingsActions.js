import axios from "axios";

import {
  GET_TESTCASE_SETTINGS,
  GET_REPORT_SETTINGS,
  SETTINGS_LOADING,
  CLEAR_REPORT_SETTINGS,
  CLEAR_TESTCASE_SETTINGS
} from "./types";

// Get User Settings
export const getTestcaseSettings = project_id => dispatch => {
  dispatch(setSettingsLoading());
  axios
    .get(`/api/projects/project/${project_id}/testcase-settings`)
    .then(res => {
      dispatch({
        type: GET_TESTCASE_SETTINGS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_TESTCASE_SETTINGS,
        payload: {}
      })
    );
};

// Get User Settings
export const getReportSettings = project_id => dispatch => {
  dispatch(setSettingsLoading());
  axios
    .get(`/api/projects/project/${project_id}/report-settings`)
    .then(res => {
      dispatch({
        type: GET_REPORT_SETTINGS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_REPORT_SETTINGS,
        payload: {}
      })
    );
};

// Edit Test Case Settings
export const editTestcaseSettings = (project_id, settingsData) => dispatch => {
  axios
    .put(`/api/projects/project/${project_id}/testcase-settings`, settingsData)
    .then(res => {
      dispatch({
        type: GET_TESTCASE_SETTINGS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_TESTCASE_SETTINGS,
        payload: {}
      })
    );
};

// Edit Report Settings
export const editReportSettings = (project_id, settingsData) => dispatch => {
  axios
    .put(`/api/projects/project/${project_id}/report-settings`, settingsData)
    .then(res => {
      dispatch({
        type: GET_REPORT_SETTINGS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_REPORT_SETTINGS,
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

export const clearTestcaseSettings = () => dispatch => {
  dispatch({
    type: CLEAR_TESTCASE_SETTINGS,
    payload: {}
  });
};

export const clearReportSettings = () => dispatch => {
  dispatch({
    type: CLEAR_REPORT_SETTINGS,
    payload: {}
  });
};
