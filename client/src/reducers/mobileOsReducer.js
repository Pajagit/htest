import { GET_MOBILE_OS } from "../actions/types";

const initialState = {
  mobileOSs: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_MOBILE_OS:
      return {
        ...state,
        mobileOSs: action.payload,
        loading: false
      };

    default:
      return state;
  }
}
