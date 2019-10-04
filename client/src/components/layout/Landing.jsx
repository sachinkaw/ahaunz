import React, { Component } from "react";
import Register from "../auth/Register";
import Login from "../auth/Login";
import Introduction from "../modal-tutorials/Introduction";

import logo from "../../img/logo.png";

class Landing extends Component {
  constructor() {
    super();
    this.state = {
      modalShow: false
    };
  }
  componentDidMount() {
    let visited = localStorage["alreadyVisited"];
    if (visited) {
      this.setState({ modalShow: false });
      //do not view Popup
    } else {
      //this is the first time
      localStorage["alreadyVisited"] = true;
      this.setState({ modalShow: true });
    }
  }
  render() {
    let modalClose = () => this.setState({ modalShow: false });
    return (
      <div className="container">
        <Introduction show={this.state.modalShow} onHide={modalClose} />
        <div>
          <div className="col-sm-12 text-center mt-7">
            <img src={logo} alt="" height="60px" width="60px" />
            <h1 className="mb-5">ĀHAU | I AM</h1>
          </div>
        </div>
        <div className="row  " style={{ height: "30em" }}>
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
