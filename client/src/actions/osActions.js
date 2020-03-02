import axios from "axios";

import { GET_OSS, GET_OS, OS_LOADING, GET_ERRORS } from "./types";

// Get All Operating Systems
export const getOperatingSystems = (project_id, pageSent, pageSizeSent) => dispatch => {
  dispatch(osLoading());
  var page = pageSent === undefined ? 1 : pageSent;
  var size = pageSizeSent === undefined ? 100 : pageSizeSent;

  axios
    .get(`/api/operatingsystems?page=${page}&page_size=${size}&project_id=${project_id}`)
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

// Get Operating System by operatingsystem_id
export const getOperatingSystem = operatingsystem_id => dispatch => {
  dispatch(osLoading());
  axios
    .get(`/api/operatingsystems/operatingsystem/${operatingsystem_id}`)
    .then(res =>
      dispatch({
        type: GET_OS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_OS,
        payload: {}
      })
    );
};

// Create Operating System
export const createOperatingSystem = (osData, callback) => dispatch => {
  dispatch(osLoading());
  axios
    .post(`/api/operatingsystems/operatingsystem`, osData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Edit Operating System by operatingsystem_id
export const editOperatingSystem = (operatingsystem_id, osData, callback) => dispatch => {
  dispatch(osLoading());
  axios
    .put(`/api/operatingsystems/operatingsystem/${operatingsystem_id}`, osData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Remove Operating System by operatingsystem_id
export const removeOperatingSystem = (operatingsystem_id, callback) => dispatch => {
  axios
    .put(`/api/operatingsystems/operatingsystem/${operatingsystem_id}/deprecated`)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Change is used for Operating System by operatingsystem_id
export const usedOperatingSystem = (operatingsystem_id, is_used, callback) => dispatch => {
  axios
    .put(`/api/operatingsystems/operatingsystem/${operatingsystem_id}/isused?used=${is_used}`)
    .then(res => callback(res))
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      callback(err.response.data);
    });
};

// Operating System loading
export const osLoading = () => {
  return {
    type: OS_LOADING
  };
};
