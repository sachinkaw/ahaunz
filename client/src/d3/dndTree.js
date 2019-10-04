import { firstTreeSave } from "../components/whakapapa/Tree";
import male from "../img/tane.png";
import female from "../img/wahine.png";
export { appendTreeToNode, first_node_menu };

// Global exports
global.edit_node = edit_node;
global.create_node = create_node;
global.create_sibling_node = create_sibling_node;
global.create_parent_node = create_parent_node;
global.create_first_node = create_first_node;

var { $, d3, _ } = global;

function appendTreeToNode({
  baseNodeSelector,
  treeData,
  onTreeUpdate,
  passcode,
  name_count,
  call_count
}) {
  console.log(
    "appendTreeToNode : ",
    baseNodeSelector,
    treeData,
    passcode,
    name_count,
    call_count
  );
  // Ugh global vars are yuck.
  global.onTreeUpdateGlobal = onTreeUpdate;
  global.root = treeData;
  global.passcode = passcode;
  global.count = name_count;
  global.call_count = call_count;
  // Calculate total nodes, max label length
  var maxLabelLength = 0;
  // variables for drag/drop
  // var selectedNode = null;
  // var draggingNode = null;
  var totalNodes = 0;
  // panning variables
  var panSpeed = 200;
  var panTimer;
  // var panBoundary = 20; // Within 20px from edges will pan when dragging.
  // Misc. variables
  var i = 0;
  var duration = 750;
  // var nodes;
  var links;
  // var dragStarted;
  // var domNode;

  // size of the diagram based on page width
  var viewerWidth = $(document).width();
  // var viewerWidth = '100%';
  var viewerHeight = $(document).height();
  // var viewerHeight = '100%';

  // var tree = d3.layout.tree().size([viewerHeight, viewerWidth]);

  // size of the diagram based on nodes
  var nodeWidth = 140;
  var nodeHeight = 140;
  var horizontalSeparationBetweenNodes = 16;
  var verticalSeparationBetweenNodes = 128;

  var tree = d3.layout
    .tree()
    .nodeSize([
      nodeWidth + horizontalSeparationBetweenNodes,
      nodeHeight + verticalSeparationBetweenNodes
    ])
    .separation(function(a, b) {
      return a.parent == b.parent ? 1 : 2;
    });

  // define a d3 diagonal projection for use by the node paths later on.
  var diagonal = d3.svg.diagonal().projection(function(d) {
    //swapped y and x for vertical tree
    return [d.x, d.y];
  });

  var menu = [
    {
      title: "Edit person",
      action: function(elm, d, i) {
        console.log("Update person");
        $("#EditNodeFirstName").val(d.fname);
        $("#EditNodeLastName").val(d.lname);
        $("#EditNodePrefName").val(d.pname);
        $("#EditNodeGender").val(d.gender);
        $("#EditNodeDob").val(d.dob);
        $("#EditNodeAdopted").val(d.adopted);
        $("#EditNodeOtherName").val(d.onames);
        $("#EditNodeOrder").val(d.order);
        edit_node_modal_active = true;
        node_to_edit = d;
        $("#EditNodeName").focus();
        $("#EditNodeModal").foundation("reveal", "open");
      }
    },
    {
      title: "Delete person",
      action: function(elm, d, i) {
        var result = window.confirm(
          "Are you sure you want to delete " +
            d.fname +
            " and all connected children from the whakapapa, It cannot be undone once deleted?"
        );
        if (result) {
          //Logic to delete the item
          console.log("Delete node");
          delete_node(d);
        }
      }
    },
    {
      title: "Add child",
      action: function(elm, d, i) {
        console.log("Add child");
        $("#CreateNodeLastName").val(d.lname);
        if (d.children) {
          $("#CreateNodeOrder").val(d.children.length + 1);
        } else {
          $("#CreateNodeOrder").val(1);
        }
        create_node_parent = d;
        create_node_modal_active = true;
        $("#CreateNodeModal").foundation("reveal", "open");
        $("#CreateNodeName").focus();
      }
    },
    {
      title: "Add sibling",
      action: function(elm, d, i) {
        console.log("sibling:", d);
        if (!d.parent) {
          $("#CreateNodeModalSiblingFail").foundation("reveal", "open");
          $("#CreateNodeNameSiblingFail").focus();
        } else {
          console.log("Add sibling");
          $("#CreateNodeLastNameSibling").val(d.lname);
          $("#CreateNodeOrderSibling").val(d.parent.children.length + 1);
          create_node_parent = d;
          create_node_modal_active = true;
          $("#CreateNodeModalSibling").foundation("reveal", "open");
          $("#CreateNodeNameSibling").focus();
        }
      }
    },
    {
      title: "Add parent",
      action: function(elm, d, i) {
        console.log("Create parent node");
        $("#CreateNodeLastNameParent").val(d.lname);
        create_node_parent = d;
        create_node_modal_active = true;
        $("#CreateNodeModalParent").foundation("reveal", "open");
        $("#CreateNodeNameParent").focus();
      }
    }
  ];

  // A recursive helper function for performing some setup by walking through all nodes

  function visit(parent, visitFn, childrenFn) {
    if (!parent) return;

    visitFn(parent);

    var children = childrenFn(parent);
    if (children) {
      var count = children.length;
      for (var i = 0; i < count; i++) {
        visit(children[i], visitFn, childrenFn);
      }
    }
  }

  // Call visit function to establish maxLabelLength
  visit(
    treeData,
    function(d) {
      totalNodes++;
      maxLabelLength = Math.max(d.pname.length, maxLabelLength);
    },
    function(d) {
      return d.children && d.children.length > 0 ? d.children : null;
    }
  );
  // this isnt working well
  function delete_node(node) {
    visit(
      treeData,
      function(d) {
        if (d.children) {
          for (var child of d.children) {
            if (child == node) {
              d.children = _.without(d.children, child);
              update(global.root);
              break;
            }
          }
        }
      },
      function(d) {
        return d.children && d.children.length > 0 ? d.children : null;
      }
    );
    global.count--;
    saveTree(global.root, global.passcode, global.count, global.call_count);
    global.onTreeUpdateGlobal &&
      global.onTreeUpdateGlobal(
        global.root,
        global.passcode,
        global.count,
        global.call_count
      );
  }

  // sort the tree according to the node names
  // TODO: this needs to be changed to be sorted from oldest to youngest (we need to think of a way to capture the order(dob, timestamp, other))
  function sortTree() {
    tree.sort(function(a, b) {
      // return b.pname.toLowerCase() < a.pname.toLowerCase() ? 1 : -1;
      // return b.order < a.order ? 1 : -1;
      // return b.dob < a.dob ? 1 : -1;
      return a.order - b.order;
    });
  }
  // Sort the tree initially incase the JSON isn't in a sorted order.
  sortTree();

  // TODO: Pan function, can be better implemented.

  function pan(domNode, direction) {
    var translateX, translateY;
    var speed = panSpeed;
    if (panTimer) {
      clearTimeout(panTimer);
      var translateCoords = d3.transform(svgGroup.attr("transform"));
      if (direction == "left" || direction == "right") {
        translateX =
          direction == "left"
            ? translateCoords.translate[0] + speed
            : translateCoords.translate[0] - speed;
        translateY = translateCoords.translate[1];
      } else if (direction == "up" || direction == "down") {
        translateX = translateCoords.translate[0];
        translateY =
          direction == "up"
            ? translateCoords.translate[1] + speed
            : translateCoords.translate[1] - speed;
      }
      // These don't do anything
      // translateCoords.scale[0]
      // translateCoords.scale[1]
      var scale = zoomListener.scale();
      svgGroup
        .transition()
        .attr(
          "transform",
          "translate(" + translateX + "," + translateY + ")scale(" + scale + ")"
        );
      d3.select(domNode)
        .select("g.node")
        .attr("transform", "translate(" + translateX + "," + translateY + ")");
      zoomListener.scale(zoomListener.scale());
      zoomListener.translate([translateX, translateY]);
      panTimer = setTimeout(function() {
        pan(domNode, speed, direction);
      }, 50);
    }
  }

  // Define the zoom function for the zoomable tree

  function zoom() {
    console.log("zooming");
    svgGroup.attr(
      "transform",
      "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"
    );
  }

  // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
  var zoomListener = d3.behavior
    .zoom()
    .scaleExtent([0.1, 3])
    .on("zoom", zoom);

  // function initiateDrag(d, domNode) {
  //   draggingNode = d;
  //   d3.select(domNode)
  //     .select(".ghostCircle")
  //     .attr("pointer-events", "none");
  //   d3.selectAll(".ghostCircle").attr("class", "ghostCircle show");
  //   d3.select(domNode).attr("class", "node activeDrag");

  //   svgGroup.selectAll("g.node").sort(function(a, b) {
  //     // select the parent and sort the path's
  //     if (a.id != draggingNode.id) return 1;
  //     // a is not the hovered element, send "a" to the back
  //     else return -1; // a is the hovered element, bring "a" to the front
  //   });
  //   // if nodes has children, remove the links and nodes
  //   if (nodes.length > 1) {
  //     // remove link paths
  //     links = tree.links(nodes);
  //     var nodePaths = svgGroup
  //       .selectAll("path.link")
  //       .data(links, function(d) {
  //         return d.target.id;
  //       })
  //       .remove();
  //     // remove child nodes
  //     var nodesExit = svgGroup
  //       .selectAll("g.node")
  //       .data(nodes, function(d) {
  //         return d.id;
  //       })
  //       .filter(function(d, i) {
  //         if (d.id == draggingNode.id) {
  //           return false;
  //         }
  //         return true;
  //       })
  //       .remove();
  //   }

  //   // remove parent link
  //   var parentLink = tree.links(tree.nodes(draggingNode.parent));
  //   svgGroup
  //     .selectAll("path.link")
  //     .filter(function(d, i) {
  //       if (d.target.id == draggingNode.id) {
  //         return true;
  //       }
  //       return false;
  //     })
  //     .remove();

  //   dragStarted = null;
  // }

  // define the baseSvg, attaching a class for styling and the zoomListener
  var baseSvg = d3
    .select(baseNodeSelector)
    .append("svg")
    .attr("width", viewerWidth)
    .attr("height", viewerHeight)
    // .attr("class", "overlay")
    .call(zoomListener);

  // baseSvg
  //   .append("rect")
  //   .attr("width", "100%")
  //   .attr("height", "100%")
  //   .attr("fill", "white");

  baseSvg.call(zoomListener);

  //========================================================================
  // Select2 stuff (search feature)
  // select2Data = [];
  // select2DataCollectName(treeData);
  // select2DataObject = [];
  // select2Data
  //   .sort(function(a, b) {
  //     if (a > b) return 1; // sort
  //     if (a < b) return -1;
  //     return 0;
  //   })
  //   .filter(function(item, i, ar) {
  //     return ar.indexOf(item) === i;
  //   }) // remove duplicate items
  //   .filter(function(item, i, ar) {
  //     select2DataObject.push({
  //       id: i,
  //       text: item
  //     });
  //   });
  // select2Data
  //   .sort(function(a, b) {
  //     if (a > b) return 1; // sort
  //     if (a < b) return -1;
  //     return 0;
  //   })
  //   .filter(function(item, i, ar) {
  //     return ar.indexOf(item) === i;
  //   }) // remove duplicate items
  //   .filter(function(item, i, ar) {
  //     select2DataObject.push({
  //       id: i,
  //       text: item
  //     });
  //   });
  // $("#searchName").select2({
  //   data: select2DataObject,
  //   containerCssClass: "search"
  // });

  // d3.select(self.frameElement).style("height", "800px");

  //===================================================

  // Define the drag listeners for drag/drop behaviour of nodes.
  // var dragListener = d3.behavior
  //   .drag()
  //   .on("dragstart", function(d) {
  //     if (d == global.root) {
  //       return;
  //     }
  //     dragStarted = true;
  //     nodes = tree.nodes(d);
  //     d3.event.sourceEvent.stopPropagation();
  //     // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
  //   })
  //   .on("drag", function(d) {
  //     if (d == global.root) {
  //       return;
  //     }
  //     if (dragStarted) {
  //       domNode = this;
  //       initiateDrag(d, domNode);
  //     }

  //     // get coords of mouseEvent relative to svg container to allow for panning
  //     var relCoords = d3.mouse($("svg").get(0));
  //     if (relCoords[0] < panBoundary) {
  //       panTimer = true;
  //       pan(this, "left");
  //     } else if (relCoords[0] > $("svg").width() - panBoundary) {
  //       panTimer = true;
  //       pan(this, "right");
  //     } else if (relCoords[1] < panBoundary) {
  //       panTimer = true;
  //       pan(this, "up");
  //     } else if (relCoords[1] > $("svg").height() - panBoundary) {
  //       panTimer = true;
  //       pan(this, "down");
  //     } else {
  //       try {
  //         clearTimeout(panTimer);
  //       } catch (e) {}
  //     }
  //     // -----------swapped for verticatl tree-------
  //     d.x0 += d3.event.dx;
  //     d.y0 += d3.event.dy;
  //     // -----------swapped for verticatl tree-------
  //     var node = d3.select(this);
  //     node.attr("transform", "translate(" + d.x0 + "," + d.y0 + ")");
  //     updateTempConnector();
  //   })
  //   .on("dragend", function(d) {
  //     if (d == global.root) {
  //       return;
  //     }
  //     domNode = this;
  //     if (selectedNode) {
  //       // now remove the element from the parent, and insert it into the new elements children
  //       var index = draggingNode.parent.children.indexOf(draggingNode);
  //       if (index > -1) {
  //         draggingNode.parent.children.splice(index, 1);
  //       }
  //       if (
  //         typeof selectedNode.children !== "undefined" ||
  //         typeof selectedNode._children !== "undefined"
  //       ) {
  //         if (typeof selectedNode.children !== "undefined") {
  //           selectedNode.children.push(draggingNode);
  //         } else {
  //           selectedNode._children.push(draggingNode);
  //         }
  //       } else {
  //         selectedNode.children = [];
  //         selectedNode.children.push(draggingNode);
  //       }
  //       // Make sure that the node being added to is expanded so user can see added node is correctly moved
  //       expand(selectedNode);
  //       sortTree();
  //       endDrag();
  //     } else {
  //       endDrag();
  //     }
  //   });

  // function endDrag() {
  //   selectedNode = null;
  //   d3.selectAll(".ghostCircle").attr("class", "ghostCircle");
  //   d3.select(domNode).attr("class", "node");
  //   // now restore the mouseover event or we won't be able to drag a 2nd time
  //   d3.select(domNode)
  //     .select(".ghostCircle")
  //     .attr("pointer-events", "");
  //   updateTempConnector();
  //   if (draggingNode !== null) {
  //     update(global.root);
  //     centerNode(draggingNode);
  //     draggingNode = null;
  //   }
  //   saveTree(global.root, global.passcode);
  // }

  // Helper functions for collapsing and expanding nodes.

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  function clearAll(d) {
    d.class = "";
    if (d.children) d.children.forEach(clearAll);
    else if (d._children) d._children.forEach(clearAll);
  }

  function collapseAllNotFound(d) {
    if (d.children) {
      if (d.class !== "found") {
        d._children = d.children;
        d._children.forEach(collapseAllNotFound);
        d.children = null;
      } else d.children.forEach(collapseAllNotFound);
    }
  }

  function expand(d) {
    if (d._children) {
      d.children = d._children;
      d.children.forEach(expand);
      d._children = null;
    }
  }

  function expandAll(d) {
    if (d._children) {
      d.children = d._children;
      d.children.forEach(expandAll);
      d._children = null;
    } else if (d.children) d.children.forEach(expandAll);
  }

  // var overCircle = function(d) {
  //   selectedNode = d;
  //   updateTempConnector();
  // };
  // var outCircle = function(d) {
  //   selectedNode = null;
  //   updateTempConnector();
  // };

  // Function to update the temporary connector indicating dragging affiliation
  // var updateTempConnector = function() {
  //   var data = [];
  //   if (draggingNode !== null && selectedNode !== null) {
  //     // have to flip the source coordinates since we did this for the existing connectors on the original tree
  //     //-------------------- swapped x and y for vertical tree--------------------------
  //     data = [
  //       {
  //         source: {
  //           x: selectedNode.x0,
  //           y: selectedNode.y0
  //         },
  //         target: {
  //           x: draggingNode.x0,
  //           y: draggingNode.y0
  //         }
  //       }
  //     ];
  //   }
  //   var link = svgGroup.selectAll(".templink").data(data);

  //   link
  //     .enter()
  //     .append("path")
  //     .attr("class", "templink")
  //     .attr("d", d3.svg.diagonal())
  //     .attr("pointer-events", "none");

  //   link.attr("d", d3.svg.diagonal());
  //   // link.attr("d", elbow);

  //   link.exit().remove();
  // };

  //===============================================
  // Toggle children on click.
  // function toggle(d) {
  //   if (d.children) {
  //     d._children = d.children;
  //     d.children = null;
  //   } else {
  //     d.children = d._children;
  //     d._children = null;
  //   }
  //   clearAll(root);
  //   update(d);
  //   $("#searchName").select2("val", "");
  // }

  // $("#searchName").on("select2-selecting", function(e) {
  //   clearAll(global.root);
  //   expandAll(global.root);
  //   update(global.root);
  //   // console.log('e.object.text')
  //   // console.log(e.object.text)
  //   searchField = "d.name";
  //   searchText = e.object.text;
  //   searchTree(global.root);
  //   root.children.forEach(collapseAllNotFound);
  //   update(global.root);
  //   centerNode(global.root);
  // });
  // function select2DataCollectName(d) {
  //   if (d.children) d.children.forEach(select2DataCollectName);
  //   else if (d._children) d._children.forEach(select2DataCollectName);
  //   select2Data.push(d.name);
  // }

  // function searchTree(d) {
  //   if (d.children) d.children.forEach(searchTree);
  //   else if (d._children) d._children.forEach(searchTree);
  //   var searchFieldValue = eval(searchField);
  //   // if (searchFieldValue && searchFieldValue.match(searchText)) {
  //   if (searchFieldValue && searchFieldValue === searchText) {
  //     // Walk parent chain
  //     var ancestors = [];
  //     var parent = d;
  //     while (typeof parent !== "undefined") {
  //       ancestors.push(parent);
  //       //console.log(parent);
  //       parent.class = "found";
  //       parent = parent.parent;
  //     }
  //     //console.log(ancestors);
  //   }
  // }
  //===============================================

  // color a node properly
  function colorNode(d) {
    var result = "#fff";
    // if (d.gender == 'm') {
    //     result = (d._children || d.children) ? "blue" : "#fff";
    // }
    // else if (d.gender == "f") {
    //     result = (d._children || d.children) ? "green" : "#fff";
    // }
    return result;
  }

  // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

  // function centerNode(source) {
  //   var scale = zoomListener.scale();
  //   //--------------- swapped x and y for vertical tree
  //   var x = -source.x0;
  //   var y = -source.y0;
  //   // var yOffset = 100;
  //   x = x * scale + viewerWidth / 2;
  //   // y = (y - yOffset) * scale + viewerHeight / 4;
  //   y = y * scale + viewerHeight / 4;
  //   d3.select("g")
  //     .transition()
  //     .duration(duration)
  //     // ---------changed  + scale + to:  + 1.8 +
  //     .attr("transform", "translate(" + x + "," + y + ")scale(" + 1.3 + ")");
  //   zoomListener.scale(scale);
  //   zoomListener.translate([x, y]);
  // }

  function centerNode(source) {
    var scale = zoomListener.scale();
    var x = -source.x0;
    var y = -source.y0;
    x = x * scale + viewerWidth / 2;
    y = y * scale + viewerHeight / 4;
    d3.select("g")
      .transition()
      .duration(duration)
      .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    zoomListener.scale(scale);
    zoomListener.translate([x, y]);
  }

  // Toggle children function

  function toggleChildren(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else if (d._children) {
      d.children = d._children;
      d._children = null;
    }
    return d;
  }

  // Toggle children on click.

  function click(d) {
    if (d3.event.defaultPrevented) return; // click suppressed
    d = toggleChildren(d);
    update(d);
    centerNode(d);
  }

  function update(source) {
    // Compute the new height, function counts total children of root node and sets tree height accordingly.
    // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
    // This makes the layout more consistent.
    var levelWidth = [10];
    var childCount = function(level, n) {
      if (n.children && n.children.length > 0) {
        if (levelWidth.length <= level + 1) levelWidth.push(0);

        levelWidth[level + 1] += n.children.length;
        n.children.forEach(function(d) {
          childCount(level + 1, d);
        });
      }
    };
    childCount(0, global.root);
    var newHeight = d3.max(levelWidth) * 90; // 25 pixels per line
    tree = tree.size([newHeight, viewerWidth]);

    // Compute the new tree layout.
    var nodes = tree.nodes(global.root).reverse();

    links = tree.links(nodes);

    // Set widths between levels based on maxLabelLength.
    nodes.forEach(function(d) {
      // d.y = d.depth * (maxLabelLength * 10); // maxLabelLength * 10px
      // alternatively to keep a fixed scale one can set a fixed depth per level
      // Normalize for fixed-depth by commenting out below line
      d.y = d.depth * 150; //300px per level.
    });

    // Update the nodes…
    var node = svgGroup.selectAll("g.node").data(nodes, function(d) {
      return d.id || (d.id = ++i);
    });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node
      .enter()
      .append("g")
      // .call(dragListener)
      .attr("class", "node")
      .attr("transform", function(d) {
        //-----------------swapped y and x for vertical tree------------------
        return "translate(" + source.x0 + "," + source.y0 + ")";
      })
      .on("click", click);

    //turn circle off - try image instead
    // nodeEnter
    //   .append("circle")
    //   .attr("class", "nodeCircle")
    //   .attr("r", 0)
    //   .style(
    //     "fill",
    //     colorNode
    //     // function(d) {
    //     //   return d._children ? "lightsteelblue" : "#fff";
    //     // }
    //   );

    nodeEnter
      .append("text")
      // .attr("x", 10)
      // .attr("y", function (d) {
      //     return d.children || d._children ? -10 : 10;
      // })
      // .attr("y", 500)
      .attr("dy", "0.35em")
      .attr("class", "nodeText")
      // .attr("transform", "rotate(45)")
      // .attr("text-anchor", function (d) {
      //   return d.children || d._children ? "end" : "start";
      // })
      .attr("text-anchor", "middle")
      .text(function(d) {
        // return d.pname;
        return d.pname ? d.pname : d.fname;
      });

    //Image as node test
    nodeEnter
      .append("image")
      .attr("xlink:href", function(d) {
        return d.gender === "m" ? male : female;
      })
      .attr("x", "-25px")
      .attr("y", "-25px")
      .attr("width", "50px")
      .attr("height", "50px")
      .attr("class", "touch");

    // phantom node to give us mouseover in a radius around it
    // nodeEnter
    //   .append("circle")
    //   .attr("class", "ghostCircle")
    //   .attr("r", 30)
    //   .attr("opacity", 0.2) // change this to zero to hide the target area
    //   .style("fill", "red")
    //   .attr("pointer-events", "mouseover")
    //   .on("mouseover", function(node) {
    //     overCircle(node);
    //   })
    //   .on("mouseout", function(node) {
    //     outCircle(node);
    //   });

    // Update the text to reflect whether node has children or not.
    node
      .select("text")
      // .attr("x", function (d) {
      //   //set text location
      //   return d.children || d._children ? -10 : -10;
      // })
      .attr(
        "text-anchor",
        "middle"
        // function(d) {
        //   return d.children || d._children ? "end" : "start";
        // }
      )
      .attr("y", 30)
      .text(function(d) {
        // return d.pname;
        return d.pname ? d.pname : d.fname;
      });

    // Change the circle fill depending on whether it has children and is collapsed
    node
      .select("circle.nodeCircle")
      .attr("r", 5)
      .style(
        "fill",
        colorNode
        // function(d) {
        //   return d._children ? "lightsteelblue" : "#fff";
        // }
      );

    // Add a context menu
    node.on("contextmenu", d3.contextMenu(menu));

    // Transition nodes to their new position.
    var nodeUpdate = node
      .transition()
      .duration(duration)
      .attr("transform", function(d) {
        //---------------swapped y and x for vertical tree--------------------
        return "translate(" + d.x + "," + d.y + ")";
      });

    // Fade the text in
    // nodeUpdate.select("text").style("fill-opacity", 1);
    nodeUpdate
      .select("text")
      .style("fill-opacity", 1)
      .style("fill", function(d) {
        if (d.gender === "m") {
          return "#005792"; //male
        } else if (d.gender === "f") {
          return "#ea168e"; //female
        }
      });

    // IAN: tried to make image change if gender was edited, but doesnt work
    // nodeUpdate
    //   .select("image")
    //   .attr("xlink:href", function (d) {
    //     return d.gender === "m" ? male : female;
    //   })
    //   .attr("x", "-25px")
    //   .attr("y", "-25px")
    //   .attr("width", "50px")
    //   .attr("height", "50px");

    nodeUpdate
      .select("circle")
      .attr("r", 6.5)
      .style("fill", function(d) {
        if (d.class === "found") {
          return "#ff4136"; //red
        } else if (d._children) {
          return "lightsteelblue";
        } else {
          return "#fff";
        }
      })
      .style("stroke", function(d) {
        if (d.class === "found") {
          return "#ff4136"; //red
        }
      });

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr("transform", function(d) {
        //--------------------swapped y and x for vertical tree-----------------
        return "translate(" + source.x + "," + source.y + ")";
      })
      .remove();

    nodeExit.select("circle").attr("r", 0);

    nodeExit.select("text").style("fill-opacity", 0);

    //===== LINKS
    //elbow link
    const elbow = (d, i) => {
      return `M${d.source.x},${d.source.y}
              V${d.target.y - 50},
              H${d.target.x},  
              V${d.target.y} `;
    };

    // Update the links…
    var link = svgGroup.selectAll("path.link").data(links, function(d) {
      return d.target.id;
    });

    // Enter any new links at the parent's previous position.
    link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      // .attr("d", elbow)
      .attr("d", function(d) {
        var o = {
          x: source.x0,
          y: source.y0
        };
        return elbow({
          source: o,
          target: o
        });
      });

    // Transition links to their new position.
    link
      .transition()
      .duration(duration)
      .attr("d", elbow);
    // .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link
      .exit()
      .transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {
          x: source.x,
          y: source.y
        };
        return elbow({
          source: o,
          target: o
        });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  outer_update = update;

  // Append a group which holds all nodes and which the zoom Listener can act upon.
  var svgGroup = baseSvg.append("g");

  // Define the root
  global.root = treeData;
  global.root.x0 = viewerHeight / 2;
  global.root.y0 = 0;

  // Layout the tree initially and center on the root node.
  update(global.root);
  centerNode(global.root);
}

function close_modal() {
  $(document).foundation("reveal", "close");
}

global.close_modal = close_modal;
// global.outer_update = outer_update;

var create_node_modal_active = false;
var edit_node_modal_active = false;
var create_node_parent = null;
var node_to_edit = null;
var first_node = null;

export function generateUUID() {
  var d = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
    c
  ) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

function create_node() {
  if (create_node_parent && create_node_modal_active) {
    if (create_node_parent._children != null) {
      create_node_parent.children = create_node_parent._children;
      create_node_parent._children = null;
    }
    if (create_node_parent.children == null) {
      create_node_parent.children = [];
    }
    var id = generateUUID();
    var fname = $("#CreateNodeFirstName").val();
    var lname = $("#CreateNodeLastName").val();
    var pname = $("#CreateNodePrefName").val();
    var gender = $("#CreateNodeGender").val();
    var dob = $("#CreateNodeDob").val();
    var adopted = $("#CreateNodeAdopted").val();
    var onames = $("#CreateNodeOtherName").val();
    var order = $("#CreateNodeOrder").val();
    // set data for new node
    var new_node = {
      fname: fname,
      lname: lname,
      pname: pname,
      onames: onames,
      gender: gender,
      dob: dob,
      adopted: adopted,
      order: order,
      id: id,
      depth: create_node_parent.depth + 1,
      children: [],
      _children: null
    };
    console.log("Add child: ", new_node);
    create_node_parent.children.push(new_node);
    //reset modal
    create_node_modal_active = false;
    $("#CreateNodeFirstName").val("");
    $("#CreateNodeLastName").val("");
    $("#CreateNodePrefName").val("");
    $("#CreateNodeGender").val("");
    $("#CreateNodeDob").val("");
    $("#CreateNodeAdopted").val("");
    $("#CreateNodeOtherName").val("");
    global.count++;
  }
  close_modal();
  outer_update(create_node_parent);
  saveTree(global.root, global.passcode, global.count, global.call_count);
}

function create_sibling_node() {
  if (create_node_parent && create_node_modal_active) {
    var id = generateUUID();
    var fname = $("#CreateNodeFirstNameSibling").val();
    var lname = $("#CreateNodeLastNameSibling").val();
    var pname = $("#CreateNodePrefNameSibling").val();
    var gender = $("#CreateNodeGenderSibling").val();
    var dob = $("#CreateNodeDobSibling").val();
    var adopted = $("#CreateNodeAdoptedSibling").val();
    var onames = $("#CreateNodeOtherNameSibling").val();
    var order = $("#CreateNodeOrderSibling").val();

    var new_node = {
      fname: fname,
      lname: lname,
      pname: pname,
      onames: onames,
      gender: gender,
      dob: dob,
      adopted: adopted,
      order: order,
      id: id,
      depth: create_node_parent.depth,
      children: [],
      _children: null
    };
    console.log("Create Sibling Node name: ", new_node);
    create_node_parent.parent.children.push(new_node);
    create_node_modal_active = false;
    $("#CreateNodeFirstNameSibling").val("");
    $("#CreateNodeLastNameSibling").val("");
    $("#CreateNodePrefNameSibling").val("");
    $("#CreateNodeGenderSibling").val("");
    $("#CreateNodeDobSibling").val("");
    $("#CreateNodeAdoptedSibling").val("");
    $("#CreateNodeOtherNameSibling").val("");

    global.count++;
  }
  close_modal();
  outer_update(create_node_parent);
  saveTree(global.root, global.passcode, global.count, global.call_count);
}

function create_parent_node() {
  if (create_node_parent && create_node_modal_active) {
    var id = generateUUID();
    var fname = $("#CreateNodeFirstNameParent").val();
    var lname = $("#CreateNodeLastNameParent").val();
    var pname = $("#CreateNodePrefNameParent").val();
    var gender = $("#CreateNodeGenderParent").val();
    var dob = $("#CreateNodeDobParent").val();
    var adopted = $("#CreateNodeAdoptedParent").val();
    var onames = $("#CreateNodeOtherNameParent").val();
    var order = $("#CreateNodeOrderParent").val();

    var currentTree = global.root;
    var topLevelDepth = currentTree.depth;

    var newNode = {
      fname: fname,
      lname: lname,
      pname: pname,
      onames: onames,
      gender: gender,
      dob: dob,
      adopted: adopted,
      order: order,
      id: id,
      depth: topLevelDepth - 1, // TODO needs to be current parent depth - 1
      children: [currentTree],
      _children: null
    };
    global.root = newNode;
    console.log("Add Parent : ", newNode);

    create_node_modal_active = false;
    $("#CreateNodeFirstNameParent").val("");
    $("#CreateNodeLastNameParent").val("");
    $("#CreateNodePrefNameParent").val("");
    $("#CreateNodeGenderParent").val("");
    $("#CreateNodeDobParent").val("");
    $("#CreateNodeAdoptedParent").val("");
    $("#CreateNodeOtherNameParent").val("");

    global.count++;
  }
  close_modal();
  outer_update(newNode);
  saveTree(global.root, global.passcode, global.count, global.call_count);
}

function edit_node() {
  if (node_to_edit && edit_node_modal_active) {
    var fname = $("#EditNodeFirstName").val();
    var lname = $("#EditNodeLastName").val();
    var pname = $("#EditNodePrefName").val();
    var gender = $("#EditNodeGender").val();
    var dob = $("#EditNodeDob").val();
    var adopted = $("#EditNodeAdopted").val();
    var onames = $("#EditNodeOtherName").val();
    var order = $("#EditNodeOrder").val();

    // console.log("Edit Node name: ", fname);
    node_to_edit.fname = fname;
    node_to_edit.lname = lname;
    node_to_edit.pname = pname;
    node_to_edit.gender = gender;
    node_to_edit.dob = dob;
    node_to_edit.adopted = adopted;
    node_to_edit.onames = onames;
    node_to_edit.order = order;

    edit_node_modal_active = false;
  }
  close_modal();
  outer_update(node_to_edit);
  saveTree(global.root, global.passcode, global.count, global.call_count);
}

function first_node_menu(d) {
  $("#CreateNodeModalFirst").foundation("reveal", "open");
  $("#CreateNodeNameFirst").focus();
  create_node_modal_active = true;
  create_parent_node = d;
}

function create_first_node() {
  if (create_node_modal_active) {
    var id = generateUUID();
    var fname = $("#CreateNodeFirstNameFirst").val();
    var lname = $("#CreateNodeLastNameFirst").val();
    var pname = $("#CreateNodePrefNameFirst").val();
    var gender = $("#CreateNodeGenderFirst").val();
    var dob = $("#CreateNodeDobFirst").val();
    var adopted = $("#CreateNodeAdoptedFirst").val();
    var onames = $("#CreateNodeOtherNameFirst").val();
    var order = $("#CreateNodeOrderFirst").val();

    var passcode = $("#CreateNodePass").val();
    // console.log("modal passcode", passcode);

    var newNode = {
      fname: fname,
      lname: lname,
      pname: pname,
      onames: onames,
      gender: gender,
      dob: dob,
      adopted: adopted,
      order: order,
      id: id,
      depth: 0,
      children: [],
      _children: null,
      x: 175,
      x0: 175,
      y: 0,
      y0: 0
    };

    create_node_modal_active = false;
    $("#CreateNodeNameFirst").val("");
    // console.log("create_node count: ", global.count);
    global.count++;
  }
  close_modal();
  // console.log("create_first_node: ", passcode, global.count);

  firstTreeSave(newNode, passcode, global.count, global.call_count);
  // saveTree(global.root, global.passcode);
}

function saveTree(root, passcode, count, call_count) {
  // console.log("savetree: ", root, passcode);
  global.onTreeUpdateGlobal &&
    global.onTreeUpdateGlobal(root, passcode, count, call_count);
}

var outer_update = null;
