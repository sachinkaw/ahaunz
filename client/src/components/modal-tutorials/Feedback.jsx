import React, { Component } from "react";
import axios from "axios";

import { Modal, Button, Form } from "react-bootstrap";

class Feedback extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      subject: "feedback",
      comments: ""
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  async onSubmit(e) {
    e.preventDefault();

    const feedback = {
      email: this.state.email,
      subject: this.state.subject,
      comments: this.state.comments
    };
    console.log("Feedback form: ", feedback);

    let form = await axios.post("/api/form", feedback);
  }

  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className=""
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Feedback Form
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-white">
          <h4>Feedback</h4>
          <Form onSubmit={this.onSubmit}>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                as="select"
                value={this.state.subject}
                name="subject"
                onChange={this.onChange}
              >
                <option>Feature request</option>
                <option>Found a bug</option>
                <option>Question</option>
                <option>Suggestion</option>
                <option>Reflection</option>
                <option>Something else</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Comments</Form.Label>
              <Form.Control
                as="textarea"
                value={this.state.comments}
                name="comments"
                onChange={this.onChange}
                rows="5"
              />
            </Form.Group>
            <Form.Group controlId="feedbackForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={this.state.email}
                name="email"
                onChange={this.onChange}
                placeholder="add you email if you would like us to reply"
              />
            </Form.Group>
            <Modal.Footer>
              <Button
                className="btn btn-red mt-4 mb-4"
                type="submit"
                variant="danger"
                onClick={this.props.onHide}
              >
                ka pai
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

export default Feedback;
