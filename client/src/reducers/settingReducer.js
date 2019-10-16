import { GET_PROJECT_SETTINGS } from "../actions/types";

const initialState = {
  settings: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PROJECT_SETTINGS:
      return {
        ...state,
        settings: action.payload,
        loading: false
      };

    default:
      return state;
  }
}
