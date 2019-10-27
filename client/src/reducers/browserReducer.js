import { GET_BROWSER, GET_BROWSERS, BROWSER_LOADING } from "../actions/types";

const initialState = {
  browser: null,
  browsers: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case BROWSER_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_BROWSER:
      return {
        ...state,
        browser: action.payload,
        loading: false
      };
    case GET_BROWSERS:
      return {
        ...state,
        browsers: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
