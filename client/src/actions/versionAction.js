import axios from "axios";

import { GET_VERSIONS, GET_VERSION, VERSION_LOADING, GET_ERRORS } from "./types";

// Get All Versions
export const getVersions = (project_id, pageSent, pageSizeSent) => dispatch => {
  dispatch(versionLoading());
  var page = pageSent === undefined ? 1 : pageSent;
  var size = pageSizeSent === undefined ? 100 : pageSizeSent;

  axios
    .get(`/api/versions?page=${page}&page_size=${size}&project_id=${project_id}`)
    .then(res =>
      dispatch({
        type: GET_VERSIONS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_VERSIONS,
        payload: {}
      })
    );
};

// Get Version by version_id
export const getVersion = version_id => dispatch => {
  dispatch(versionLoading());
  axios
    .get(`/api/versions/version/${version_id}`)
    .then(res =>
      dispatch({
        type: GET_VERSION,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_VERSION,
        payload: {}
      })
    );
};

// Create Version
export const createVersion = (versionData, callback) => dispatch => {
  dispatch(versionLoading());
  axios
    .post(`/api/versions/version`, versionData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Edit Version by version_id
export const editVersion = (version_id, versionData, callback) => dispatch => {
  dispatch(versionLoading());
  axios
    .put(`/api/versions/version/${version_id}`, versionData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Remove Version by version_id
export const removeVersion = (version_id, callback) => dispatch => {
  axios
    .delete(`/api/versions/version/${version_id}`)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Version loading
export const versionLoading = () => {
  return {
    type: VERSION_LOADING
  };
};
