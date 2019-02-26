const express = require("express");
const router = express.Router();
const passport = require("passport");
const { stringify } = require("flatted");

const validateTreeRegisterInput = require("../../validation/treeregister");
const validateLoginInput = require("../../validation/treelogin");

const Whakapapa = require("../../models/Whakapapa");

router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

router.post("/treeregister", (req, res) => {
  console.log("hitting treeregister api");
  console.log("req----------------------", req.body);
  //const { errors, isValid } = validateTreeRegisterInput(req.body);

  console.log("req.body", req.body);

  res.json({ msg: "Users Works" });

  console.log("check validation");
  //if (!isValid) {
  // return res.status(400).json(errors);
  //}

  console.log("Before FindOne");

  Whakapapa.findOne({ passcode: req.body.passcode }).then(passcode => {
    if (passcode) {
      errors.passcode = "Passcode already exists";
      return res.status(400).json(errors);
    } else {
      const newPasscode = new Whakapapa({
        passcode: req.body.passcode,
        data: "null"
        // passcode: 1
      });

      console.log("newPasscodeeeeeeeeeeeeeeeee", newPasscode);

      newPasscode
        .save()
        .then(passcode => res.json(passcode))
        .catch(err => console.log(err));
    }
    console.log("findOne Exit");
  });
});

// @route   POST api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/treelogin", (req, res) => {
  //const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  //if (!isValid) {
  //return res.status(400).json(errors);
  //}
  console.log("Inside treelogin with req.body:", req.body);

  const passcode = req.body.passcode;

  console.log("Inside treelogin with passcode:", passcode);

  Whakapapa.findOneAndUpdate({ passcode })
    .then(whakapapa => {
      if (whakapapa === null) {
        return new Whakapapa({
          passcode,
          data: stringify({ name: req.user.name })
        }).save();
      }

      return Promise.resolve(whakapapa);
    })
    .then(whakapapa => {
      res.json({ whakapapa });
    })
    .catch(err => {
      console.log(err);
      res.ok();
    });
  /*
  Whakapapa.findOne({ passcode: req.body.passcode }).then(passcode => {
    if (passcode) {
      console.log("treelogin: Passcode Exists");
    } else {
      console.log(
        "treelogin: Passcode Doesn't Exists, error will be worked on later"
      );
      errors.passwordLogin = "Login incorrect";
      return res.status(400).json(errors);
    }
    console.log("treelogin: findOne Exit");
  });
  */
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("authenticated user: ", req.user);
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
