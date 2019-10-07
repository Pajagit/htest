import axios from "axios";

import { GET_PROJECT, GET_PROJECTS, PROJECT_LOADING, GET_ERRORS } from "./types";

// Get All Projects
export const getProjects = () => dispatch => {
  dispatch(projectLoading());
  axios
    .get("/api/projects")
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