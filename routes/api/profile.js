const express = require("express");

const router = express.Router();

// @route  GET api/profile
// @desc   Test profile route
// @access Public
router.get("/", (req, res) => {
  res.send("Profile working");
});

module.exports = router;
