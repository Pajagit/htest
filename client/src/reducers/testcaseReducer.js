import { GET_TESTCASES, TESTCASE_LOADING } from "../actions/types";

const initialState = {
  testcase: null,
  testcases: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TESTCASE_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_TESTCASES:
      return {
        ...state,
        testcases: action.payload,
        loading: false
      };

    default:
      return state;
  }
}
