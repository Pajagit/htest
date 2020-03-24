import axios from "axios";

import { GET_DEVICES, GET_DEVICE, DEVICE_LOADING, GET_ERRORS, CLEAR_DEVICES } from "./types";

// Get All Devices
export const getDevices = (offices, project_id, pageSent, pageSizeSent) => dispatch => {
  dispatch(deviceLoading());
  var page = pageSent === undefined ? 1 : pageSent;
  var size = pageSizeSent === undefined ? 100 : pageSizeSent;
  var data = {};
  if (offices) {
    data.offices = offices.offices;
  }

  if (project_id) {
    data.project_id = project_id;
  }

  axios
    .post(`/api/devices?page=${page}&page_size=${size}`, data)
    .then(res =>
      dispatch({
        type: GET_DEVICES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_DEVICES,
        payload: {}
      })
    );
};

// Get Device by device_id
export const getDevice = device_id => dispatch => {
  dispatch(deviceLoading());
  axios
    .get(`/api/devices/device/${device_id}`)
    .then(res =>
      dispatch({
        type: GET_DEVICE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_DEVICE,
        payload: {}
      })
    );
};

// Create Device
export const createDevice = (deviceData, callback) => dispatch => {
  dispatch(deviceLoading());
  axios
    .post(`/api/devices/device`, deviceData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Edit Device by device_id
export const editDevice = (device_id, deviceData, callback) => dispatch => {
  dispatch(deviceLoading());
  axios
    .put(`/api/devices/device/${device_id}`, deviceData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Remove Device by device_id
export const removeDevice = (device_id, callback) => dispatch => {
  axios
    .put(`/api/devices/device/${device_id}/deprecated`)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set device as used/not used on project
export const deviceIsUsed = (device_id, is_used, project_id, callback) => dispatch => {
  axios
    .put(`/api/devices/device/${device_id}/isused?used=${is_used}&project_id=${project_id}`)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Device loading
export const deviceLoading = () => {
  return {
    type: DEVICE_LOADING
  };
};

export const clearDevices = () => dispatch => {
  dispatch({
    type: CLEAR_DEVICES,
    payload: {}
  });
};
