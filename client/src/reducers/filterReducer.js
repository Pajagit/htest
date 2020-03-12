import { GET_REPORT_FILTERS, GET_TESTCASE_FILTERS } from "../actions/types";

const initialState = {
  report_filters: null,
  testcase_filters: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_REPORT_FILTERS:
      return {
        ...state,
        report_filters: action.payload,
        loading: false
      };
    case GET_TESTCASE_FILTERS:
      return {
        ...state,
        testcase_filters: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
