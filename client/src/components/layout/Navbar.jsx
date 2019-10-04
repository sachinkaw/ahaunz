import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";
import { logoutTree } from "../../actions/treeActions";
import { Navbar, Nav } from "react-bootstrap";

import logo from "../../img/logo-white.png";
import treeLogo from "../../img/users.png";

class AhauNavBar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutTree(this.props.history);
    this.props.logoutUser(this.props.history);
  }

  onLogoutTree(e) {
    e.preventDefault();
    this.props.logoutTree(this.props.history);
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { tree } = this.props.tree;

    let authLinks;
    if (Object.keys(user).length > 0) {
      authLinks = (
        // <ul className="navbar-nav ml-auto">
        <Nav.Link
          className="ml-2"
          href="/"
          onClick={this.onLogoutClick.bind(this)}
        >
          <img
            className="rounded-circle"
            src={user.avatar}
            alt={user.name}
            style={{ width: "25px", marginRight: "5px" }}
            title="click here to logout"
          />
          Logout
        </Nav.Link>
      );
    }

    let treeLinks;

    if (Object.keys(tree).length > 0) {
      treeLinks = (
        // <ul className="navbar-nav ml-auto">
        <Nav.Link
          className="ml-2"
          href="/select"
          onClick={this.onLogoutTree.bind(this)}
        >
          <img
            className="rounded-circle"
            src={treeLogo}
            alt={tree.whanau}
            style={{ width: "25px", marginRight: "5px" }}
            title="click here to logout"
          />
          Logout of whakapapa
        </Nav.Link>
      );
    }

    return (
      <div>
        <Navbar
          collapseOnSelect
          bg="dark"
          variant="dark"
          expand="md"
          fixed="top"
        >
          <div className="container">
            <Navbar.Brand href="/">
              <img src={logo} alt="" height="30px" width="30px" />
            </Navbar.Brand>
            <Nav>
              <Nav.Link href="/"> {""}Āhau | I am </Nav.Link>
            </Nav>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link className="ml-2" href="mailto: info@ahau.io">
                  {" "}
                  Contact{" "}
                </Nav.Link>
                <Nav.Link className="ml-2" href="/policy">
                  {" "}
                  Privacy{" "}
                </Nav.Link>
                {treeLinks}
                {authLinks}
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>
      </div>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  logoutTree: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  tree: state.tree
});

export default connect(
  mapStateToProps,
  { logoutUser, clearCurrentProfile, logoutTree }
)(withRouter(AhauNavBar));
