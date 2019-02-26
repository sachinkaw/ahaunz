import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginTree } from "../../actions/authTreeActions";
import { withRouter } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";

class TreeLogin extends Component {
  constructor() {
    super();

    this.state = {
      passcode: "",
      errors: {}
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/treelogin");
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

    const passcode = {
      passcode: this.state.passcode
    };
    this.props.loginTree(passcode, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="login bg-dark">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <p className="lead text-center text-white">
                Enter your whanau passcode to VIEW and BUILD your whakapapa
              </p>
              <div className="mt-5">
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    className="white-input"
                    placeholder="Whanau passcode"
                    name="passcode"
                    value={this.state.emailLogin}
                    onChange={this.onChange}
                    error={errors.emailLogin}
                    type="password"
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

TreeLogin.propTypes = {
  loginTree: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginTree }
)(withRouter(TreeLogin));
