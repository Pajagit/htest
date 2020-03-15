import { GET_PROJECT_STATISTICS, GET_GLOBAL_STATISTICS, STATISTICS_LOADING } from "../actions/types";

const initialState = {
  project_statistics: null,
  global_statistics: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case STATISTICS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PROJECT_STATISTICS:
      return {
        ...state,
        project_statistics: action.payload,
        loading: false
      };
    case GET_GLOBAL_STATISTICS:
      return {
        ...state,
        global_statistics: action.payload,
        loading: false
      };

    default:
      return state;
  }
}
