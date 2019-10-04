import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginTree } from "../../actions/treeActions";
import { withRouter } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";

class TreeLogin extends Component {
  constructor() {
    super();

    this.state = {
      whanauLogin: "",
      passcodeLogin: "",
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
      whanau: this.state.whanauLogin,
      passcode: this.state.passcodeLogin
    };
    this.props.loginTree(whakapapa, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="login bg-dark">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h2 className="display-5 text-center text-white">
                Access Whakapapa
              </h2>
              <p className="lead text-center text-white">
                Enter your secret whanāu passcode to access your whakapapa
              </p>
              <div className="mt-5">
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    className="white-input"
                    placeholder="Whanau name"
                    name="whanauLogin"
                    value={this.state.whanauLogin}
                    onChange={this.onChange}
                    error={errors.whanauLogin}
                    type="text"
                  />
                  <TextFieldGroup
                    className="white-input"
                    placeholder="Whanau passcode"
                    name="passcodeLogin"
                    value={this.state.passcodeLogin}
                    onChange={this.onChange}
                    error={errors.passcodeLogin}
                    type="password"
                  />
                  <input
                    type="submit"
                    className="btn btn-red mt-4 mb-4"
                    value="Login"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TreeLogin.propTypes = {
  loginTree: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginTree }
)(withRouter(TreeLogin));
