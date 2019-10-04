const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//load Profile Model
const Profile = require("../../models/Profile");
//Load User Model
const User = require("../../models/User");
//Load validation model
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

//@route     GET api/profile/test
//@desc      Tests profile route
//@access    Public
router.get("/test", (req, res) => res.json({ msg: "Profile works" }));

//@route     GET api/profile
//@desc      get current users profile info
//@access    Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "email", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "No profile found for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route     GET api/profile/all
//@desc      GET all profiles
//@access    public
router.get("/all", (req, res) => {
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "No Profiles found";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ user: "No Profiles found" }));
});

//@route     GET api/profile/user/:user_id
//@desc      get profile by user_id
//@access    public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "No Profile found for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({ user: "No User found for this Id" }));
});

//@route     GET api/profile/user/user_name
//@desc      get profile by user_name
//@access    public
router.get("/username/:user_name", (req, res) => {
  const errors = {};
  User.findOne({ name: req.params.user_name })
    .then(user => {
      if (!user) {
        errors.nouser = "No User found for this user name";
        return res.status(404).json(errors);
      }
      console.log(user);
      Profile.findOne({ user: user._id })
        .populate("user", ["name", "avatar"])
        .then(profile => {
          if (!profile) {
            errors.noprofile = "No Profile found for this user";
            return res.status(404).json(errors);
          }
          res.json(profile);
        });
    })
    .catch(err =>
      res.status(404).json({ user: "No Profile found for this user name" })
    );
});

//@route     POST api/profile
//@desc      create or update user profile info
//@access    Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    //Check validation
    if (!isValid) {
      //return errors
      return res.status(400).json(errors);
    }

    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.dob) profileFields.dob = req.body.dob;
    if (req.body.phone) profileFields.phone = req.body.phone;
    if (req.body.bio) profileFields.bio = req.body.bio;
    //location object
    // if (req.body.location) profileFields.location = req.body.location;
    profileFields.location = {};
    if (req.body.street) profileFields.location.street = req.body.street;
    if (req.body.city) profileFields.location.city = req.body.city;
    if (req.body.country) profileFields.location.country = req.body.country;
    if (req.body.postcode) profileFields.location.postcode = req.body.postcode;
    if (req.body.current) profileFields.location.current = req.body.current;

    //skills split into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }

    //social object
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.github) profileFields.social.github = req.body.github;
    if (req.body.gitlabs) profileFields.social.gitlabs = req.body.gitlabs;
    if (req.body.date) profileFields.date = req.body.date;
    //careers object
    // if (req.body.career) profileFields.career = req.body.career;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update Profile
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create Profile

        // Save Profile
        new Profile(profileFields).save().then(profile => res.json(profile));
      }
    });
  }
);

//@route     POST api/profile/experience
//@desc      Add experience to profile
// //@access    Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    //Check validation
    if (!isValid) {
      //return errors
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current
      };

      //Add to experience array
      profile.career.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    });
  }
);

//@route     POST api/profile/education
//@desc      Add education to profile
//@access    Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    //Check validation
    if (!isValid) {
      //return errors
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        field: req.body.field,
        school: req.body.school,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        transcript: req.body.transcript
      };

      //Add to education array
      profile.career.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
  }
);

//@route     DELETE api/profile/experience/:exp_id
//@desc      Delete experience from profile via exp_id
//@access    Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //Get remove index
        const removeIndex = profile.career.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        //Splice out of array
        profile.career.experience.splice(removeIndex, 1);

        //Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route     DELETE api/profile/education/:exp_id
//@desc      Delete education from profile via exp_id
//@access    Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //Get remove index
        const removeIndex = profile.career.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);
        console.log(removeIndex);

        //Splice out of array
        profile.career.education.splice(removeIndex, 1);

        //Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route     DELETE api/profile
//@desc      Delete user and profile
//@access    Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() => {
        res.json({ sucess: true });
      });
    });
  }
);

module.exports = router;
