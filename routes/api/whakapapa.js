const express = require("express");
const router = express.Router();

const validateTreeRegisterInput = require("../../validation/treeregister");
const validateTreeLoginInput = require("../../validation/treelogin");

const Whakapapa = require("../../models/Whakapapa");

router.get("/test", (req, res) => res.json({ msg: "tree Works" }));

// @route   POST api/treeusers/treeregister
// @desc    create new family tree with passcode
// @access  Private
router.post("/treeregister", (req, res) => {
  console.log("hitting treeregister backend");
  console.log("req.body: ", req.body);

  const { errors, isValid } = validateTreeRegisterInput(req.body);

  //check validation;
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Whakapapa.findOne({ whanau: req.body.whanau }).then(whanau => {
    if (whanau) {
      errors.whanau = "Whakapapa already exisits with this name";
      return res.status(400).json(errors);
    } else {
      const newTree = new Whakapapa({
        whanau: req.body.whanau,
        passcode: req.body.passcode,
        data: "",
        name_count: 0,
        call_count: 0
      });

      newTree
        .save()
        .then(whakapapa => res.json(whakapapa))
        .catch(err => console.log(err));
    }
  });
});

// @route   POST api/treeusers/treelogin
// @desc    login to family tree with passcode
// @access  Needs to be m ade private
router.post("/treelogin", (req, res) => {
  console.log("Inside treelogin with req.body: ", req.body);
  const { errors, isValid } = validateTreeLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const whanau = req.body.whanau;
  const passcode = req.body.passcode;

  // Find tree by whanau name
  Whakapapa.findOne({ whanau })
    .then(tree => {
      if (!tree) {
        errors.whanauLogin = "No whakapapa found for this whanau";
        return res.status(404).json(errors);
      }
      // else if (tree) {
      //   Whakapapa.findOneAndUpdate(
      //     { passcode: pass },
      //     { call_count: call_count++ }
      //   ).then(tree => {
      //     console.log("Login DB res: ", tree);
      //     res.json(tree);
      //   });
      // }
      if (passcode === tree.passcode) {
        console.log("tree login api: ", tree);
        res.json(tree);
      } else {
        errors.passcodeLogin = "Whanau passcode is incorrect";
        return res.status(400).json(errors);
      }
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST api/treeusers/savetree
// @desc    save tree or create new tree if one doesnt exist
// @access  Needs to be made private
router.post("/savetree", (req, res) => {
  console.log("savetree api: ", req.body);
  const pass = req.body.passcode;
  const data = req.body.data;
  const name = req.body.name_count;
  const call = req.body.call_count;

  Whakapapa.findOne({ passcode: pass })
    .then(tree => {
      if (tree) {
        // Update Profile
        console.log("still counting: ", name);
        Whakapapa.findOneAndUpdate(
          { passcode: pass },
          {
            data: data,
            name_count: name,
            call_count: call
          },
          { new: true }
        ).then(newTree => {
          console.log("updateDB res: ", newTree);
          res.json(newTree);
        });
      } else {
        const newTree = new Whakapapa({
          passcode: pass,
          data: data
        });
        newTree
          .save()
          .then(tree => res.json(tree))
          .catch(err => console.log(err));
      }
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;
