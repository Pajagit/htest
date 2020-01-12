import { GET_TEST_SETUP, TEST_SETUP_LOADING } from "../actions/types";

const initialState = {
  testSetup: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TEST_SETUP_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_TEST_SETUP:
      return {
        ...state,
        testSetup: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
