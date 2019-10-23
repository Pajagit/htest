import { GET_DEVICE, GET_DEVICES, DEVICE_LOADING, CLEAR_DEVICES } from "../actions/types";

const initialState = {
  device: null,
  devices: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case DEVICE_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_DEVICE:
      return {
        ...state,
        device: action.payload,
        loading: false
      };
    case GET_DEVICES:
      return {
        ...state,
        devices: action.payload,
        loading: false
      };
    case CLEAR_DEVICES:
      return initialState;

    default:
      return state;
  }
}
