import React, { Component } from "react";
import TreeRegister from "./TreeRegister";
import TreeLogin from "./TreeLogin";
import Terms from "../modal-tutorials/Terms";

import logo from "../../img/logo.png";

class Select extends Component {
  constructor() {
    super();
    this.state = {
      modalShow: false,
      feedbackShow: false
    };
  }

  componentDidMount() {
    let agreed = localStorage["alreadyAgreed"];
    if (agreed) {
      this.setState({ modalShow: false });
      //do not view Popup
    } else {
      //this is the first time
      // localStorage["alreadyAgreed"] = true;
      this.setState({ modalShow: true });
    }
  }

  render() {
    return (
      <div className="container">
        <Terms show={this.state.modalShow} />
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
              <TreeLogin />
            </div>
          </div>
          <div className="col-lg-6 border">
            <div className="m-4">
              <TreeRegister />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Select;
