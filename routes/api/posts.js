const express = require("express");
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");

const router = express.Router();

//models
const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// @route  POST api/posts
// @desc   Create a post
// @access Public
router.post(
  "/",
  [
    auth,
    [
      check("text", "The text area cannot be empty")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      return res.json(post);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }
);

// @route  GET api/posts
// @desc   Get all posts
// @access Public
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    if (!posts) {
      return res.status(404).json({ msg: "No posts found!" });
    }

    return res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// @route  GET api/posts
// @desc   Get post by ID
// @access Public
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found with that ID!" });
    }

    return res.json(post);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found with that ID!" });
    }
    console.log(err);
    res.status(500).send("Server error");
  }
});

// @route  DELETE api/posts
// @desc   Delete post by ID
// @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found with that ID!" });
    }

    // check to make sure user is owner of post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: "User not authorized"
      });
    }

    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Post not found with that ID!" });
    }
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
