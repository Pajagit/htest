import { GET_OSS, GET_OS, OS_LOADING } from "../actions/types";

const initialState = {
  os: null,
  oss: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case OS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_OS:
      return {
        ...state,
        os: action.payload,
        loading: false
      };
    case GET_OSS:
      return {
        ...state,
        oss: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
