import { GET_ROLE, GET_ROLES, ROLE_LOADING } from "../actions/types";

const initialState = {
  role: null,
  roles: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ROLE_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_ROLES:
      return {
        ...state,
        roles: action.payload,
        loading: false
      };
    case GET_ROLE:
      return {
        ...state,
        role: action.payload,
        loading: false
      };

    default:
      return state;
  }
}
