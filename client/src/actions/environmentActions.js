import axios from "axios";

import { GET_ENVIRONMENTS, GET_ENVIRONMENT, ENVIRONMENT_LOADING, GET_ERRORS } from "./types";

// Get All Environments
export const getEnvironments = (project_id, pageSent, pageSizeSent) => dispatch => {
  dispatch(environmentLoading());
  var page = pageSent === undefined ? 1 : pageSent;
  var size = pageSizeSent === undefined ? 100 : pageSizeSent;

  axios
    .get(`/api/environments?page=${page}&page_size=${size}&project_id=${project_id}`)
    .then(res =>
      dispatch({
        type: GET_ENVIRONMENTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ENVIRONMENTS,
        payload: {}
      })
    );
};

// Get Environments by environment_id
export const getEnvironment = environment_id => dispatch => {
  dispatch(environmentLoading());
  axios
    .get(`/api/environments/environment/${environment_id}`)
    .then(res =>
      dispatch({
        type: GET_ENVIRONMENT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ENVIRONMENT,
        payload: {}
      })
    );
};

// Create environment
export const createEnvironment = (environmentData, callback) => dispatch => {
  dispatch(environmentLoading());
  axios
    .post(`/api/environments/environment`, environmentData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Edit environment by environment_id
export const editEnvironment = (environment_id, environmentData, callback) => dispatch => {
  dispatch(environmentLoading());
  axios
    .put(`/api/environments/environment/${environment_id}`, environmentData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Remove Environment by environment_id
export const removeEnvironment = (environment_id, callback) => dispatch => {
  axios
    .put(`/api/environments/environment/${environment_id}/deprecated`)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Change is used for Environment by environment_id
export const usedEnvironment = (environment_id, is_used, callback) => dispatch => {
  axios
    .put(`/api/environments/environment/${environment_id}/isused?used=${is_used}`)
    .then(res => callback(res))
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      callback(err.response.data);
    });
};

// Environment loading
export const environmentLoading = () => {
  return {
    type: ENVIRONMENT_LOADING
  };
};
