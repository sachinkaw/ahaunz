import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_TREE_USER } from "./types";

// Register Tree User
export const registerTreeUser = (passcode, history) => dispatch => {
  console.log("frontend: registerTreeUser");
  console.log("userData = ", passcode);

  axios
    .post("/api/treeusers/treeregister", passcode)
    .then(res => history.push("/treelogin"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
  // {TODO} register also logs in user
  // .then(loginTree(userData, history));
};

// Login - Get user token

export const loginTree = (passcode, history) => dispatch => {
  console.log("frontend: loginTree");
  console.log("userData = ", passcode);

  axios
    .post("/api/treeusers/treelogin", passcode)
    .then(res => history.push("/whakapapa"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_TREE_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = history => dispatch => {
  history.push("/");
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  // remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which willwhich will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
