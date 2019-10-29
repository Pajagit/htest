import { GET_VERSION, GET_VERSIONS, VERSION_LOADING } from "../actions/types";

const initialState = {
  version: null,
  versions: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case VERSION_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_VERSION:
      return {
        ...state,
        version: action.payload,
        loading: false
      };
    case GET_VERSIONS:
      return {
        ...state,
        versions: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
