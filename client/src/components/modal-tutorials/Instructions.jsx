import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";

class Instructions extends Component {
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
            Using this tool
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Instructions</h4>
          <p>
            This tool has been designed for <b>use on a computer</b>
            <br />
            If you are on a mobile the look and feel will not be great, but it
            will still work and we will be working to make this better soon
            <br />
          </p>
          <p>
            We have designed this tool so anyone who has access can create,
            explore and update whananu whakapapa records. <br />
            To do this we have built in some core features and will continue to
            add more as we find time. As this prototype is a beta version please
            note you will need to create a different whakapapa record for each
            of your different whānau lines.
            <br />
            <b>Pan : </b> Click anywhere and hold and move the mouse, to move
            the tree around
            <br />
            <b>Zoom : </b> Use the mouse scroll to Zoom in or out. You can also
            double click to Zoom in <br />
            <b>Add : </b> Right click on any person and select Add. You can can
            a parent, child, or sibling.
            <br />
            <b>Update : </b> Right click on any person and select Update to edit
            their information <br />
            <b>Delete : </b> Right click on any person and select Delete to
            remove a person and their children from the tree. Please be careful
            when deleting someone as that information cannot be brought back and
            will have to be added again. <br />
            <b>Sort : </b> When adding a person, use order of birth to sort the
            name in order from 1st born - last born. <br />
            <b>Exit : </b> To exit click Logout of the whakapapa or logout of
            your account <br />
          </p>
          <p>
            Start by clicking on someone or entering a person in your family.
            You cant start anywhere on the tree, perhaps start with yourself
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-red mt-4 mb-4"
            id="feedback-btn"
            onClick={this.props.onHide}
          >
            Ka pai
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Instructions;
