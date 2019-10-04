import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerTreeUser } from "../../actions/treeActions";
import { withRouter } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";

class TreeRegister extends Component {
  constructor() {
    super();

    this.state = {
      whanau: "",
      passcode: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const whakapapa = {
      whanau: this.state.whanau,
      passcode: this.state.passcode
    };
    this.props.registerTreeUser(whakapapa, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h2 className="display-5 text-center">Create Whakapapa</h2>
              <p className="lead text-center">
                Create a seceret whānau passcode to access your whakapapa
              </p>
              <div className="mt-5">
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder="Whanāu name"
                    name="whanau"
                    value={this.state.whanau}
                    onChange={this.onChange}
                    error={errors.whanau}
                  />
                  <TextFieldGroup
                    placeholder="Whanau passcode"
                    name="passcode"
                    value={this.state.passcode}
                    onChange={this.onChange}
                    error={errors.passcode}
                  />

                  <input type="submit" className="btn btn-red mt-4 mb-4" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TreeRegister.propTypes = {
  registerTreeUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerTreeUser }
)(withRouter(TreeRegister));
