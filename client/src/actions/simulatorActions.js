import axios from "axios";

import { GET_SIMULATOR, GET_SIMULATORS, SIMULATOR_LOADING, GET_ERRORS } from "./types";

// Get All Simulators
export const getSimulators = (project_id, pageSent, pageSizeSent) => dispatch => {
  dispatch(simulatorLoading());
  var page = pageSent === undefined ? 1 : pageSent;
  var size = pageSizeSent === undefined ? 100 : pageSizeSent;
  var data = {};
  data.emulator = false;
  if (project_id) {
    data.project_id = project_id
  }
  axios
    .post(`/api/simulators?page=${page}&page_size=${size}`, data)
    .then(res =>
      dispatch({
        type: GET_SIMULATORS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_SIMULATORS,
        payload: {}
      })
    );
};

// Get Simulator by simulator_id
export const getSimulator = simulator_id => dispatch => {
  dispatch(simulatorLoading());
  axios
    .get(`/api/simulators/simulator/${simulator_id}`)
    .then(res =>
      dispatch({
        type: GET_SIMULATOR,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_SIMULATOR,
        payload: {}
      })
    );
};

// Create Simulator
export const createSimulator = (simulatorData, callback) => dispatch => {
  dispatch(simulatorLoading());
  axios
    .post(`/api/simulators/simulator`, simulatorData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Edit Simulator by simulator_id
export const editSimulator = (simulator_id, simulatorData, callback) => dispatch => {
  axios
    .put(`/api/simulators/simulator/${simulator_id}`, simulatorData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Remove Simulator by simulator_id
export const removeSimulator = (simulator_id, callback) => dispatch => {
  axios
    .put(`/api/simulators/simulator/${simulator_id}/deprecated`)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set simulator as used/not used on project
export const simulatorIsUsed = (simulator_id, is_used, project_id, callback) => dispatch => {

  axios
    .put(`/api/simulators/simulator/${simulator_id}/isused?used=${is_used}&project_id=${project_id}`)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Simulator loading
export const simulatorLoading = () => {
  return {
    type: SIMULATOR_LOADING
  };
};
