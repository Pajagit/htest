import { GET_SETTINGS } from "./types";

// Edit Test Case by Test Case id
export const editSettings = viewSettings => dispatch => {
  dispatch({
    type: GET_SETTINGS,
    payload: viewSettings
  });
};
