import axios from "axios";

import { GET_GROUPS, GET_GROUP, GROUP_LOADING, GET_ERRORS } from "./types";

// Get All Groups
export const getGroups = project_id => dispatch => {
  axios
    .get(`/api/groups?project_id=${project_id}`)
    .then(res =>
      dispatch({
        type: GET_GROUPS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_GROUPS,
        payload: {}
      })
    );
};

// Get  Group by group_id
export const getGroup = group_id => dispatch => {
  dispatch(groupLoading());
  axios
    .get(`/api/groups/group/${group_id}`)
    .then(res =>
      dispatch({
        type: GET_GROUP,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_GROUP,
        payload: {}
      })
    );
};

// Create Group
export const createGroup = (groupData, callback) => dispatch => {
  dispatch(groupLoading());
  axios
    .post(`/api/groups/group`, groupData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Edit  Group by group_id
export const editGroup = (group_id, groupData, callback) => dispatch => {
  axios
    .put(`/api/groups/group/${group_id}`, groupData)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Remove  Group by group_id
export const removeGroup = (group_id, callback) => dispatch => {
  axios
    .delete(`/api/groups/group/${group_id}`)
    .then(res => callback(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Group loading
export const groupLoading = () => {
  return {
    type: GROUP_LOADING
  };
};
