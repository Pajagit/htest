import axios from "axios";

import { GET_PROJECT, GET_PROJECTS, PROJECT_LOADING, GET_ERRORS } from "./types";

// Get All Projects
export const getProjects = (searchTerm, page) => dispatch => {
  var page_size = 2;
  var url;
  if (searchTerm) {
    url = `/api/projects?search_term=${searchTerm}&page=${page}&page_size=${page_size}`;
  } else {
    url = `/api/projects?page=${page}&page_size=${page_size}`;
  }
  dispatch(projectLoading());
  axios
    .get(url)
    .then(res =>
      dispatch({
        type: GET_PROJECTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROJECTS,
        payload: {}
      })
    );
};

// Get  Project by project_id
export const getProject = project_id => dispatch => {
  dispatch(projectLoading());
  axios
    .get(`/api/projects/project/${project_id}`)
    .then(res =>
      dispatch({
        type: GET_PROJECT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROJECT,
        payload: {}
      })
    );
};

// Edit  Project by project_id
export const editProject = (project_id, projectData, callback) => dispatch => {
  axios
    .put(`/api/projects/project/${project_id}`, projectData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Create Project
export const createProject = (projectData, callback) => dispatch => {
  dispatch(projectLoading());
  axios
    .post(`/api/projects/project`, projectData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Project loading
export const projectLoading = () => {
  return {
    type: PROJECT_LOADING
  };
};

export const clearProject = () => dispatch => {
  dispatch({
    type: GET_PROJECT,
    payload: {}
  });
};
