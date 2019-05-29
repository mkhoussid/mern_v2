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

// @route  PUT api/posts/like/:id
// @desc   Like a post by ID
// @access Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const likes = post.likes.filter(
      like => like.user.toString() === req.user.id
    );

    if (likes.length > 0) {
      return res.status(400).json({ msg: "User already liked this post" });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// @route  PUT api/posts/unlike/:id
// @desc   Unlike a post by ID
// @access Private
router.put("/unlike/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ msg: "Post not found" });
  }

  if (
    post.likes.filter(like => like.user.toString() === req.user.id).length === 0
  ) {
    return res.status(400).json({ msg: "Post has not been liked yet" });
  }

  const removeIndex = post.likes
    .map(like => like.user.toString())
    .indexOf(req.user.id);

  post.likes.splice(removeIndex, 1);

  await post.save();

  return res.json(post.likes);
});

// @route  POST api/posts/comment/:id
// @desc   Create a comment
// @access Private
router.post(
  "/comment/:id",
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
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();

      return res.json(post.comments);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }
);

// @route  DELETE api/posts/comment/:post_id/:comment_id
// @desc   Delete a comment
// @access Private
router.delete("/comments/:post_id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found!" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User unauthorized" });
    }

    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
