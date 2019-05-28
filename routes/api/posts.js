const express = require("express");

const router = express.Router();

// @route  GET api/post
// @desc   Test post route
// @access Public
router.get("/", (req, res) => {
  res.send("Posts working");
});

module.exports = router;
