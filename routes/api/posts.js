const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Post model
const Post = require("../../models/Post");
//Profile model
const Profile = require("../../models/Profile");

//Post Validation
const validatePostInput = require("../../validation/post");

//@route     GET api/posts/test
//@desc      Tests post route
//@access    Public
router.get("/test", (req, res) => res.json({ msg: "Posts works" }));

//@route GET api/posts
//@desc Get all posts
//@access Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ noPostsFound: "No posts found" }));
});

//@route GET api/posts/:id
//@desc Get posts by id
//@access Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ noPostFound: "No post found with that id" })
    );
});

//@route POST api/posts
//@desc Creste post
//@access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //Check validation
    if (!isValid) {
      //If errors, send 400 with errors object
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

//@route DELETE api/posts/:id
//@desc Delete a post
//@access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id).then(post => {
          //Check got post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notAtuthorised: "User not authorised" });
          }
          //Delete post
          post.remove().then(() => res.json({ success: true }));
        });
      })
      .catch(err => res.status(404).json({ postNotFound: "No post found" }));
  }
);

//@route POST api/posts/like/:id
//@desc Like/unlike a post
//@access Private
router.post(
  "/likes/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //Check if the user has liked the post already
          const likeIndex = post.likes.findIndex(
            like => like.user.toString() === req.user.id
          );
          if (likeIndex !== -1) {
            //remove like (skipped section 5, lecture 27 create separate route for unlike)
            // Splice out of array
            post.likes.splice(likeIndex, 1);
            //Save
            post.save().then(post => res.json(post));
          }
          //Add user if to likes
          else {
            post.likes.unshift({ user: req.user.id });
            post.save().then(post => res.json(post));
          }
        })
        .catch(err => res.status(404).json({ postNotFound: "No post found" }));
    });
  }
);

//@route POST api/posts/comment/:id
//@desc Add comment to a post
//@access Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //Check validation
    if (!isValid) {
      //If errors, send 400 with errors object
      return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        //Add to comments array
        post.comments.unshift(newComment);

        //Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postNotFound: "No post found" }));
  }
);

//@route DELETE api/posts/comment/:id/:comment_id
//@desc Delete comment on post
//@access Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //check to see if comment exists
        const commentIndex = post.comments.findIndex(
          comment => comment._id.toString() === req.params.comment_id
        );
        if (commentIndex !== -1) {
          //remove comment
          // Splice out of array
          post.comments.splice(commentIndex, 1);
          //Save
          post.save().then(post => res.json(post));
        }
        //Add user if to likes
        else {
          return res
            .status(404)
            .json({ commentNotExist: "Comment does not exist" });
        }
      })
      .catch(err => res.status(404).json({ postNotFound: "No post found" }));
  }
);

module.exports = router;
