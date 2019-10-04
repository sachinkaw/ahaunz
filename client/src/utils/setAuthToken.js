import axios from "axios";

const setAuthToken = token => {
  if (token) {
    // apply to every request
    axios.defaults.headers.common["Authorisation"] = token;
  } else {
    // delete auth header
    delete axios.defaults.headers.common["Authorisation"];
  }
};

export default setAuthToken;
