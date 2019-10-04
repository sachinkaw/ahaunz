import React from "react";
import axios from "axios";
// import manaariki from "../../manaariki";
import { appendTreeToNode, first_node_menu } from "../../d3/dndTree";
import { stringify, parse } from "flatted";
import { setTree } from "../../actions/treeActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import Instructions from "../modal-tutorials/Instructions";
import Feedback from "../modal-tutorials/Feedback";

import { GET_ERRORS } from "../../actions/types";

import configureStore from "../../store";

const { store } = configureStore;

// const containerStyles = {
//   width: "100%",
//   height: "100vh"
// };

class CenteredTree extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      modalShow: false,
      fdModalShow: false,
      inModalShow: false
    };
  }

  componentDidMount() {
    let helped = localStorage["alreadyHelped"];
    if (helped) {
      this.setState({ modalShow: false });
      //do not view Popup
    } else {
      //this is the first time
      localStorage["alreadyHelped"] = true;
      this.setState({ modalShow: true });
    }

    var { data, passcode, name_count, call_count } = this.props.tree.tree;

    window.requestAnimationFrame(function() {
      if (data === "") {
        first_node_menu();
        document.getElementById("CreateNodePass").value = passcode; //TODO: better security
      } else {
        var treeData = parse(data);
        // console.log("appenTreeToNode treeData = ", treeData);

        appendTreeToNode({
          baseNodeSelector: "#tree-container",
          treeData,
          onTreeUpdate,
          passcode,
          name_count,
          call_count
        });
      }
    });
  }

  render() {
    const { whanau } = this.props.tree.tree;
    const loading = this.props.tree.loading;
    let tree;
    if (loading) {
      tree = <Spinner />;
    } else {
      tree = <div id="tree-container" />;
    }
    let modalClose = () => this.setState({ modalShow: false });
    let fbModalClose = () => this.setState({ fbModalShow: false });
    let inModalClose = () => this.setState({ inModalShow: false });

    return (
      <div>
        <Instructions show={this.state.modalShow} onHide={modalClose} />
        <Instructions show={this.state.inModalShow} onHide={inModalClose} />
        <Feedback show={this.state.fbModalShow} onHide={fbModalClose} />
        <div className="row mt-7">
          <div className=" mr-auto text-left ml-2">
            <h1>{whanau}</h1>
          </div>
          <div className=" mr-2">
            <button
              className="btn btn-red"
              id="feedback-btn"
              onClick={() => this.setState({ fbModalShow: true })}
            >
              Feedback
            </button>
          </div>
          <div className=" mr-2">
            <button
              className="btn btn-red"
              id="instuction-btn"
              onClick={() => this.setState({ inModalShow: true })}
            >
              Instructions
            </button>
          </div>
        </div>
        {tree}
      </div>
    );
  }
}

export function firstTreeSave(data, passcode, name_count, call_count) {
  //NOTE: we need to store the data as a string created by flatted because our js objects have circular refs.
  var treeString = stringify(data);
  var treeData = parse(treeString);
  console.log("firstTreeSave data: ", treeData);
  console.log("firstTreeSave passcode: ", passcode);
  console.log("firstTreeSaved name count: ", name_count);
  console.log("firstTreeSaved call count: ", call_count);
  appendTreeToNode({
    baseNodeSelector: "#tree-container",
    treeData,
    onTreeUpdate,
    passcode,
    name_count,
    call_count
  });
}

function onTreeUpdate(data, passcode, name_count, call_count) {
  //NOTE: we need to store the data as a string created by flatted because our js objects have circular refs.
  data = stringify(data);
  const tree = {
    data: data,
    passcode: passcode,
    name_count: name_count,
    call_count: call_count
  };
  console.log("onTreeUpdate: ", tree);
  //Here: update the DB
  axios
    .post("/api/whakapapa/savetree", tree)
    .then(res => {
      //return tree and setTree
      console.log("Tree saved: ", res.data);
      const whakapapa = res.data;
      store.dispatch(setTree(whakapapa));
    })
    .catch(err =>
      store.dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}

CenteredTree.propTypes = {
  auth: PropTypes.object.isRequired,
  tree: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  tree: state.tree
});

export default connect(mapStateToProps)(CenteredTree);

//
