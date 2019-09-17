import axios from "axios";
import setAuthToken from "./setAuthToken";
import jwt_decode from "jwt-decode";
// import { clearCurrentProfile } from "./profileActions";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import store from "../store";

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localStorage
      const { token, refreshToken } = res.data;
      // Set token to ls
      //   localStorage.setItem("jwtToken", token);
      //   localStorage.setItem("jwtRefreshToken", refreshToken);
      // Set token to Auth header
      //   setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      console.log(decoded);
      var user = {};
      user.id = 1;
      user.firstName = decoded.given_name;
      user.lastName = decoded.family_name;
      user.email = decoded.email;
      // Set current user
      dispatch(setCurrentUser(user));
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
