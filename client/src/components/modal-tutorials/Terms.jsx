import React, { Component } from "react";
import { Form, Button, Modal } from "react-bootstrap";

class Terms extends Component {
  constructor() {
    super();

    this.state = {
      validated: false
    };
  }
  handleSubmit(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ validated: true });
    localStorage["alreadyAgreed"] = true;
  }

  render() {
    const { validated, show } = this.state;
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            He Taonga te Whakapapa, He Tapu te Whakapapa
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            The overall security and accessibility of your whakapapa will be
            dependent on your ability to keep your whānau passcode a secret, and
            only share it with those you trust so that you can make your
            collective whānau whakapapa record. Please make sure that you
            remember your passcode, make a secure copy of it and store it
            somewhere safe as the passcode cannot be changed and if it is lost,
            it will be lost forever. In using this tool you understand the
            importance of and agree to only sharing the passcode with trusted
            whānau members or someone you have personally elected to act on your
            behalf.
          </p>
          <h4>Whakapapa is precious</h4>
          <p>
            The information held in whakapapa records are whānau treasures and
            should be treated with the upmost respect in accordance with your
            own tikanga and kawa and that of your whānau, hapū, iwi.
            <br />
            By using Āhau you acknowledge the significance of your whakapapa and
            personal information and the obligations that come with protecting
            your whānau knowledge and connection. We ask that you will act with
            right intention and behaviour in relation to your information.
          </p>
        </Modal.Body>
        <Form
          noValidate
          validated={validated}
          onSubmit={e => this.handleSubmit(e)}
        >
          <Form.Group controlId="formBasicChecbox">
            <Form.Check
              type="checkbox"
              required
              label="Agree to terms and conditions"
              feedback="You must agree before submitting."
            />
          </Form.Group>
          <Modal.Footer>
            <input
              type="submit"
              className="btn btn-red mt-4 mb-4"
              value="Whakaae"
            />
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default Terms;
