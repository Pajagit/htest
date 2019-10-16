import { GET_PROJECT_SETTINGS, SETTINGS_LOADING, CLEAR_SETTINGS } from "../actions/types";

const initialState = {
  settings: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SETTINGS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PROJECT_SETTINGS:
      return {
        ...state,
        settings: action.payload,
        loading: false
      };
    case CLEAR_SETTINGS:
      return initialState;
    default:
      return state;
  }
}
