import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class Introduction extends Component {
  constructor() {
    super();

    this.state = {
      viewPopup: "false"
    };
  }

  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Nau Mai Haere Mai Whānau
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Welcome to whanau.io</h4>
          <p>
            This is an experimental tool for building and sharing whakapapa
            amongst whānau.
            <br />A resource to learn, connect, and possibly identify some of
            the missing links in your whakapapa.
            <br />
            This tool is, and will always be <b>free to use.</b> <br />
            If you have any questions, suggestions, or reflections we would love
            to <a href="mailto: info@ahau.io"> hear from you</a>
            <br />
            <br />
            <b>To get started please register and login</b>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-red mt-4 mb-4"
            id="feedback-btn"
            onClick={this.props.onHide}
          >
            Whakaae
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Introduction;
