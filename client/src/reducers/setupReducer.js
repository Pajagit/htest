import { GET_TESTCASE_SETUP } from "../actions/types";

const initialState = {
  testcase_setup: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TESTCASE_SETUP:
      return {
        ...state,
        testcase_setup: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
