import axios from "axios";
import setAuthToken from "./setAuthToken";
import jwt_decode from "jwt-decode";
// import { clearCurrentProfile } from "./profileActions";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";
// import store from "../store";

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localStorage
      const { token, refreshToken } = res.data;
      // Set token to ls
      localStorage.setItem("jwtHtestToken", token);
      localStorage.setItem("jwtHtestRefreshToken", refreshToken);
      // Set token to Auth header

      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem("jwtHtestToken");
  localStorage.removeItem("jwtHtestRefreshToken");

  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will also set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
