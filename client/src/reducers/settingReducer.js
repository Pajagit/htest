import { GET_VIEW_MODE, GET_ACTIVE_FILTERS, GET_TESTCASE_FILTERS } from "../actions/types";

const initialState = {
  viewMode: "Grid",
  activeFilters: true,
  testcaseFilters: { groups: [], users: [], dateFrom: "", dateTo: "" },
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_VIEW_MODE:
      return {
        ...state,
        viewMode: action.payload,
        loading: false
      };
    case GET_ACTIVE_FILTERS:
      return {
        ...state,
        activeFilters: action.payload,
        loading: false
      };
    case GET_TESTCASE_FILTERS:
      return {
        ...state,
        testcaseFilters: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
