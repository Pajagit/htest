import { GET_REPORT, GET_REPORTS, REPORT_LOADING, CLEAR_REPORT } from "../actions/types";

const initialState = {
  report: null,
  reports: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REPORT_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_REPORT:
      return {
        ...state,
        report: action.payload,
        loading: false
      };
    case GET_REPORTS:
      return {
        ...state,
        reports: action.payload,
        loading: false
      };
    case CLEAR_REPORT:
      return {
        ...state,
        report: null,
        loading: false
      };
    default:
      return state;
  }
}
