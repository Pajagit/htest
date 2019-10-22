import { GET_SIMULATOR, GET_SIMULATORS, SIMULATOR_LOADING } from "../actions/types";

const initialState = {
  simulator: null,
  simulators: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SIMULATOR_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_SIMULATOR:
      return {
        ...state,
        simulator: action.payload,
        loading: false
      };
    case GET_SIMULATORS:
      return {
        ...state,
        simulators: action.payload,
        loading: false
      };

    default:
      return state;
  }
}
