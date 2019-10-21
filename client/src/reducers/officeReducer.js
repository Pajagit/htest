import { GET_OFFICES } from "../actions/types";

const initialState = {
  office: null,
  offices: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_OFFICES:
      return {
        ...state,
        offices: action.payload,
        loading: false
      };

    default:
      return state;
  }
}
