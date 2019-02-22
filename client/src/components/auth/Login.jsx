import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import { withRouter } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";

class Login extends Component {
  constructor() {
    super();

    this.state = {
      emailLogin: "",
      passwordLogin: "",
      errors: {}
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/whakapapa");
    }
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

    const userData = {
      email: this.state.emailLogin,
      password: this.state.passwordLogin
    };

    this.props.loginUser(userData, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="login bg-dark">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center text-white">Log In</h1>
              <p className="lead text-center text-white">
                Sign in to your Āhau account
              </p>
              <div className="mt-5">
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    className="white-input"
                    placeholder="Email Address"
                    name="emailLogin"
                    type="email"
                    value={this.state.emailLogin}
                    onChange={this.onChange}
                    error={errors.emailLogin}
                  />
                  <TextFieldGroup
                    className="white-input"
                    placeholder="Password"
                    name="passwordLogin"
                    type="password"
                    value={this.state.passwordLogin}
                    onChange={this.onChange}
                    error={errors.passwordLogin}
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

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(withRouter(Login));
