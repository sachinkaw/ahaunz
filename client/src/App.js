import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { logoutTree } from "./actions/treeActions";

import PrivateRoute from "./components/common/PrivateRoute";

import AhauNavbar from "./components/layout/Navbar";
//import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Policy from "./components/layout/Policy";

import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/create-profile/CreateProfile";

import TreeRegister from "./components/whakapapa/TreeRegister";
import TreeLogin from "./components/whakapapa/TreeLogin";
import Select from "./components/whakapapa/Select";
import Tree from "./components/whakapapa/Tree";

import "./App.css";
import { decode } from "punycode";
import { clearCurrentProfile } from "./actions/profileActions";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import configureStore from "./store";
const { persistor, store } = configureStore;

// Check for token
if (localStorage.jwtToken) {
  console.log("store: ", store);
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info nd exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decode.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // TODO: Clear current Profile
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    store.dispatch(logoutTree());
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <div className="App">
              <AhauNavbar />
              <div>
                <Route exact path="/" component={Landing} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/policy" component={Policy} />
                <Switch>
                  <PrivateRoute exact path="/whakapapa" component={Tree} />
                  <PrivateRoute exact path="/dashboard" component={Dashboard} />
                  <PrivateRoute
                    exact
                    path="/create-profile"
                    component={CreateProfile}
                  />
                  <PrivateRoute
                    exact
                    path="/treeregister"
                    component={TreeRegister}
                  />
                  <PrivateRoute exact path="/treelogin" component={TreeLogin} />
                  <PrivateRoute exact path="/select" component={Select} />
                </Switch>
              </div>
              {/* <Footer /> */}
            </div>
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
