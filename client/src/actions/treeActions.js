import { TREE_LOGIN } from "./types";

// Log user out
export const loginTree = (passcode, history) => dispatch => {
  history.push("/TreeLogin");

  dispatch({
    type: TREE_LOGIN,
    payload: passcode
  });
};
