import axios from "axios";

import { GET_BROWSERS, GET_BROWSER, BROWSER_LOADING, GET_ERRORS } from "./types";

// Get All Browsers
export const getBrowsers = (project_id, pageSent, pageSizeSent) => dispatch => {
  dispatch(browserLoading());
  var page = pageSent === undefined ? 1 : pageSent;
  var size = pageSizeSent === undefined ? 100 : pageSizeSent;

  axios
    .get(`/api/browsers?page=${page}&page_size=${size}&project_id=${project_id}`)
    .then(res =>
      dispatch({
        type: GET_BROWSERS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_BROWSERS,
        payload: {}
      })
    );
};

// Get Browser by browser_id
export const getBrowser = browser_id => dispatch => {
  dispatch(browserLoading());
  axios
    .get(`/api/browsers/browser/${browser_id}`)
    .then(res =>
      dispatch({
        type: GET_BROWSER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_BROWSER,
        payload: {}
      })
    );
};

// Create Browser
export const createBrowser = (browserData, callback) => dispatch => {
  dispatch(browserLoading());
  axios
    .post(`/api/browsers/browser`, browserData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Edit Browser by browser_id
export const editBrowser = (browser_id, browserData, callback) => dispatch => {
  dispatch(browserLoading());
  axios
    .put(`/api/browsers/browser/${browser_id}`, browserData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Remove Browser by browser_id
export const removeBrowser = (browser_id, callback) => dispatch => {
  axios
    .put(`/api/browsers/browser/${browser_id}/deprecated`)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Change is used for Browser by browser_id
export const usedBrowser = (browser_id, is_used, callback) => dispatch => {
  axios
    .put(`/api/browsers/browser/${browser_id}/isused?used=${is_used}`)
    .then(res => callback(res))
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      callback(err.response.data);
    });
};

// Device loading
export const browserLoading = () => {
  return {
    type: BROWSER_LOADING
  };
};
