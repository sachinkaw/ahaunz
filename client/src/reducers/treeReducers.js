import { SET_TREE_USER, TREE_LOADING } from "../actions/types";

const initialState = {
  loading: false,
  tree: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TREE_LOADING:
      return {
        ...state,
        loading: true
      };
    case SET_TREE_USER:
      return {
        ...state,
        tree: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
