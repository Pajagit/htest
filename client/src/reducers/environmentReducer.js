import { GET_ENVIRONMENT, GET_ENVIRONMENTS, ENVIRONMENT_LOADING } from "../actions/types";

const initialState = {
  environment: null,
  environments: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ENVIRONMENT_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_ENVIRONMENT:
      return {
        ...state,
        environment: action.payload,
        loading: false
      };
    case GET_ENVIRONMENTS:
      return {
        ...state,
        environments: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
