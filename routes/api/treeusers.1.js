const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load Input Validation
const validateTreeRegisterInput = require("../../validation/treeregister");
const validateLoginInput = require("../../validation/treelogin");

// Load User model
const Passcode = require("../../models/Whakapapa");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/treeregister", (req, res) => {
  console.log("hitting treeregister api");
  console.log("req----------------------", req.body);
  //const { errors, isValid } = validateTreeRegisterInput(req.body);

  console.log("req.body", req.body);

  res.json({ msg: "Users Works" });
  //Check Validation

  console.log("check validation");
  //if (!isValid) {
  // return res.status(400).json(errors);
  //}

  console.log("Before FindOne");

  Passcode.findOne({ passcode: req.body.passcode }).then(passcode => {
    if (passcode) {
      errors.passcode = "Passcode already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.passcode, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default
      });

      const newPasscode = new Passcode({
        password: req.body.password
        // passcode: 1
      });

      console.log("newPasscodeeeeeeeeeeeeeeeee", newPasscode);

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newPasscode.passcode, salt, (err, hash) => {
          if (err) throw err;
          newPasscode.passcode = hash;
          newPAsscode
            .save()
            .then(passcode => res.json(passcode))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   POST api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.emailLogin = "User not found";
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token
              //token: "Bearer " + token
            });
          }
        );
      } else {
        errors.passwordLogin = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
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
