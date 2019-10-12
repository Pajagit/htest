import { GET_VIEW_MODE, GET_ACTIVE_FILTERS, GET_TESTCASE_FILTERS } from "./types";

// Edit user view mode
export const editViewMode = viewSettings => dispatch => {
  dispatch({
    type: GET_VIEW_MODE,
    payload: viewSettings
  });
};

// Edit user filter activity
export const editFilterActivity = filterSettings => dispatch => {
  dispatch({
    type: GET_ACTIVE_FILTERS,
    payload: filterSettings
  });
};

// Edit user filters
export const editFilters = filters => dispatch => {
  dispatch({
    type: GET_TESTCASE_FILTERS,
    payload: filters
  });
};
