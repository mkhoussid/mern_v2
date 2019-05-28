const config = require("config");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator/check");

const router = express.Router();

const auth = require("../../middleware/auth");

const User = require("../../models/User");

// @route  GET api/auth
// @desc   Test auth route
// @access Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (err) {
    console.log(err.message);

    res.status(500).send("Server error");
  }
});

// @route  POST api/auth
// @desc   Authenticate user and get token
// @access Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // send back any errors
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    try {
      // check if user exists, send error if so
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }
      // return jsonwebtoken so that way they're logged in right
      // away, without having to log in after registering
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: process.env.PORT ? 3600 : 36000
        },
        (err, token) => {
          if (err) throw err;

          return res.json({ token });
        }
      );

      // res.send("User registered");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
