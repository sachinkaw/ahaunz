import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import profileReducer from "./profileReducer";
import treeReducer from "./treeReducers";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer,
  tree: treeReducer
});
