import axios from "axios";

import { GET_PROJECT, GET_PROJECTS, PROJECT_LOADING } from "./types";

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

// Project loading
export const projectLoading = () => {
  return {
    type: PROJECT_LOADING
  };
};
