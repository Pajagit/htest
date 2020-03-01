import { GET_STATUSES } from "../actions/types";

const initialState = {
  statuses: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_STATUSES:
      return {
        ...state,
        statuses: action.payload,
        loading: false
      };

    default:
      return state;
  }
}
