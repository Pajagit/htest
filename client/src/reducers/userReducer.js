import { GET_USER, GET_USERS, USER_LOADING } from "../actions/types";

const initialState = {
  user: null,
  users: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
        loading: false
      };
    case GET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false
      };

    default:
      return state;
  }
}
