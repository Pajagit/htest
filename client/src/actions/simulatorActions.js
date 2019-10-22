import axios from "axios";

import { GET_SIMULATORS, GET_SIMULATOR, SIMULATOR_LOADING, GET_ERRORS } from "./types";

// Get All Simulators
export const getSimulators = (pageSent, pageSizeSent) => dispatch => {
  dispatch(simulatorLoading());
  var page = pageSent === undefined ? 1 : pageSent;
  var size = pageSizeSent === undefined ? 100 : pageSizeSent;
  axios
    .post(`api/devices?page=${page}&page_size=${size}&simulator=true`, offices)
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

// Get Simulator by device_id
export const getSimulator = device_id => dispatch => {
  dispatch(simulatorLoading());
  axios
    .get(`/api/devices/simulator/${device_id}`)
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
    .post(`/api/devices/simulator`, simulatorData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Edit Simulator by device_id
export const editSimulator = (device_id, simulatorData, callback) => dispatch => {
  axios
    .put(`/api/devices/simulator/${device_id}`, simulatorData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Remove Simulator by device_id
export const removeDevice = (device_id, callback) => dispatch => {
  axios
    .delete(`/api/devices/simulator/${device_id}`)
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
