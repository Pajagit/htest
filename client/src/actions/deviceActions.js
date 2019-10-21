import axios from "axios";

import { GET_DEVICES, GET_DEVICE, DEVICE_LOADING, GET_ERRORS } from "./types";

// Get All Devices
export const getDevices = (officeId, pageSent, pageSizeSent) => dispatch => {
  dispatch(deviceLoading());
  var page = pageSent === undefined ? 1 : pageSent;
  var size = pageSizeSent === undefined ? 100 : pageSizeSent;

  var url = `api/devices?page=${page}&page_size=${size}`;
  if (officeId) {
    url = `api/devices?office_id=${officeId}&page=${page}&page_size=${size}`;
  }
  axios
    .get(url)
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

// Device loading
export const deviceLoading = () => {
  return {
    type: DEVICE_LOADING
  };
};
