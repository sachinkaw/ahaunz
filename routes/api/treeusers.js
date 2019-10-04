// const express = require("express");
// const router = express.Router();
// const passport = require("passport");
// const { stringify } = require("flatted");

// const validateTreeRegisterInput = require("../../validation/treeregister");
// const validateLoginInput = require("../../validation/treelogin");

// const Whakapapa = require("../../models/Whakapapa");

// router.get("/test", (req, res) => res.json({ msg: "tree Works" }));

// // @route   POST api/treeusers/treeregister
// // @desc    create new family tree with passcode
// // @access  Private
// router.post("/treeregister", (req, res) => {
//   console.log("hitting treeregister api");
//   console.log("req.body: ", req.body);
//   //const { errors, isValid } = validateTreeRegisterInput(req.body);

//   //check validation;
//   //if (!isValid) {
//   // return res.status(400).json(errors);
//   //}

//   Whakapapa.findOne({ passcode: req.body.passcode }).then(passcode => {
//     if (passcode) {
//       errors.passcode = "Please use a different passcode";
//       return res.status(400).json(errors);
//     } else {
//       const newTree = new Whakapapa({
//         passcode: req.body.passcode,
//         data: ""
//       });
//       newTree
//         .save()
//         .then(passcode => res.json(passcode))
//         .catch(err => console.log(err));
//     }
//   });
// });

// // @route   POST api/treeusers/treelogin
// // @desc    login to family tree with passcode
// // @access  Needs to be m ade private
// router.post("/treelogin", (req, res) => {
//   console.log("Inside treelogin with req.body: ", req.body);
//   const errors = {};
//   //const { errors, isValid } = validateLoginInput(req.body);

//   // Check Validation
//   //if (!isValid) {
//   //return res.status(400).json(errors);
//   //}

//   Whakapapa.findOne({ passcode: req.body.passcode })
//     .then(tree => {
//       if (!tree) {
//         errors.noTree = "No whakapapa found for this passcode";
//         return res.status(404).json(errors);
//       }
//       console.log("tree login api: ", tree);
//       res.json(tree);
//     })
//     .catch(err => res.status(404).json(err));
// });

// // @route   POST api/treeusers/savetree
// // @desc    save tree or create new tree if one doesnt exist
// // @access  Needs to be made private
// router.post("/savetree", (req, res) => {
//   console.log("savetree api: ", req.body);
//   const pass = req.body.pass;
//   const data = req.body.data;
//   Whakapapa.findOne({ passcode: pass })
//     .then(tree => {
//       if (tree) {
//         // Update Profile
//         Whakapapa.findOneAndUpdate(
//           { passcode: pass },
//           { data: data },
//           { new: true }
//         ).then(newTree => {
//           console.log("updateDB res: ", newTree);
//           res.json(newTree);
//         });
//       } else {
//         const newTree = new Whakapapa({
//           passcode: pass,
//           data: data
//         });
//         newTree
//           .save()
//           .then(tree => res.json(tree))
//           .catch(err => console.log(err));
//       }
//     })
//     .catch(err => res.status(404).json(err));
// });

// module.exports = router;
