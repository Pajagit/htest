import { GET_TESTCASE_SETTINGS, GET_REPORT_SETTINGS, SETTINGS_LOADING, CLEAR_SETTINGS } from "../actions/types";

const initialState = {
  testcase_settings: null,
  report_settings: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SETTINGS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_TESTCASE_SETTINGS:
      return {
        ...state,
        testcase_settings: action.payload,
        loading: false
      };
    case GET_REPORT_SETTINGS:
      return {
        ...state,
        report_settings: action.payload,
        loading: false
      };
    case CLEAR_SETTINGS:
      return initialState;
    default:
      return state;
  }
}
