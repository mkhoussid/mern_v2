const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const config = require("config");

const router = express.Router();

const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");

// @route  POST api/users
// @desc   Register user
// @access Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // send back any errors
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    try {
      // check if user exists, send error if so
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // get gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      // encrypt the password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
