import React from "react";
import clone from "clone";
import manaariki from "../../manaariki";
import { appendTreeToNode } from "../../d3/dndTree";
import axios from "axios";
import { stringify, parse } from "flatted";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const { d3 } = global;
const debugData = manaariki;

const containerStyles = {
  width: "100%",
  height: "100vh"
};

class CenteredTree extends React.PureComponent {
  state = {
    data: debugData
  };

  componentDidMount() {
    const passcode = {
      passcode: this.props.tree.passcode
    };

    window.requestAnimationFrame(function() {
      console.log("func passcode =", passcode);
      axios
        .post("/api/whakapapa", passcode)
        .then(res => {
          var data = res.data.whakapapa.data;
          var treeData = parse(data);

          appendTreeToNode({
            baseNodeSelector: "#tree-container",
            treeData,
            onTreeUpdate
          });
        })
        .catch(err => {
          console.log("error getting from whakapapa", err);
        });
    });
  }

  render() {
    return (
      <div>
        <div id="tree-container" />
      </div>
    );
  }
}

function onTreeUpdate(treeData) {
  //NOTE: we need to store the treeData as a string created by flatted because our js objects have circular refs.
  treeData = stringify(treeData);
  //Here: update the DB
  axios
    .post("/api/whakapapa", { data: treeData })
    .then(res => {
      // DB update was successful, nothing else to do.
    })
    // inform the user something went wrong saving their latest. But do that later, not for the demo
    .catch(err => console.log("updating db failed with error: ", err));
}

CenteredTree.propTypes = {
  auth: PropTypes.object.isRequired,
  tree: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  tree: state.tree,
  auth: state.auth
});

export default connect(mapStateToProps)(CenteredTree);
