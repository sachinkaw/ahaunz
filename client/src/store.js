import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel1 from "redux-persist/lib/stateReconciler/autoMergeLevel1";

import rootReducer from "./reducers";

const middleware = [thunk];

const intialState = {};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const store = createStore(
//   persistReducer,
//   intialState,
//   composeEnhancers(applyMiddleware(...middleware))
// );

const persistConfig = {
  key: "root",
  storage: storage,
  stateReconciler: autoMergeLevel1,
  blacklist: ["errors"] // errors will not be persisted
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  intialState,
  composeEnhancers(applyMiddleware(...middleware))
);
const persistor = persistStore(store);

export default { store, persistor };
