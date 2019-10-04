import axios from "axios";

import { GET_ERRORS, SET_TREE_USER, TREE_LOADING } from "./types";

// Register new family tree
export const registerTreeUser = (whakapapa, history) => dispatch => {
  console.log("frontend: registerTreeUser");
  console.log("whakapapa = ", whakapapa);

  axios
    .post("/api/whakapapa/treeregister", whakapapa)
    .then(res => history.push("/treelogin"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
  // {TODO} register also logs into tree
};

// Login - login to family tree
export const loginTree = (whakapapa, history) => dispatch => {
  dispatch(setTreeLoading());
  //send whakapapa to backend whakapapa route
  console.log("treelogin frontend api: ", whakapapa);
  axios
    .post("/api/whakapapa/treelogin", whakapapa)
    .then(res => {
      console.log("DB treelogin res: ", res.data);
      const whakapapa = res.data;
      console.log("whakapapa count: ", whakapapa.call_count);
      whakapapa.call_count++;
      console.log("whakapapa count: ", whakapapa.call_count);
      // dispatch whakapapa to reducer
      dispatch(setTree(whakapapa));
      history.push("/whakapapa");
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// set logged in family tree
export const setTree = whakapapa => {
  return {
    type: SET_TREE_USER,
    payload: whakapapa
  };
};

export const logoutTree = history => dispatch => {
  history.push("/select");
  // Set current tree to {}
  dispatch(setTree({}));
};

export const setTreeLoading = () => {
  return {
    type: TREE_LOADING
  };
};
