const express = require("express");

const router = express.Router();

const Profile = require("../../models/Profile");
const user = require("../../models/User");

const { check, validationResult } = require("express-validator/check");

// middleware
const auth = require("../../middleware/auth");

// @route  GET api/profile/me
// @desc   Fetch current user profile
// @access Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is no profile associated with this user!" });
    }

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// @route  POST api/profile
// @desc   Create or update a user profile
// @access Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills are required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubUsername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // build profile object
    const profileFields = {};

    profileFields.user = req.user.id;

    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (website) profileFields.website = website;
    if (company) profileFields.company = company;
    if (location) profileFields.location = location;
    if (githubUsername) profileFields.githubUsername = githubUsername;

    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    // build Social object
    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      profile = new Profile(profileFields);

      await profile.save();

      return res.json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }
);

// @route  GET api/profile
// @desc   Get all profiles
// @access Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);

    res.json(profiles);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user id
// @access Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route  DELETE api/profile
// @desc   Delete profile
// @access Private
router.delete("/", auth, async (req, res) => {
  try {
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
