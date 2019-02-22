import React, { Component } from "react";
import Register from "../auth/Register";
import Login from "../auth/Login";

import logo from "../../img/logo.png";

class Landing extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12 text-center mt-5">
            <img src={logo} alt="" height="60px" width="60px" />
            <h1 className="mb-5">ĀHAU | I AM</h1>
          </div>
        </div>
        <div
          className="row justify-content-md-center "
          style={{ height: "30em" }}
        >
          <div className="col-lg-6 border bg-dark">
            <div className=" m-4">
              <Login />
            </div>
          </div>
          <div className="col-lg-6 border">
            <div className="m-4">
              <Register />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
