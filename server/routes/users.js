const express = require("express");
const router = express.Router();
const userService = require("../services/users");
const generateJWT = require("../utilities/jwt");
const passport = require("passport");

router.post("/register", async (req, res, next) => {
  try {
    const newUser = {
      username: req.body.username,
      password: req.body.password,
      bio: req.body.bio,
    };
    const user = await userService.register(newUser);
    res.json({ success: true, message: "Registration is successful" });
  } catch (err) {
    res.json({ success: false, msg: err.message });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = {
      username: req.body.username,
      password: req.body.password,
    };
    const _id = await userService.login(user);
    const token = generateJWT(_id);
    res.status(200).json({
      success: true,
      token: token.token,
      expiresIn: token.expires,
    });
  } catch (error) {
    res.status(error.status).json({ success: false, msg: error.message });
  }
});

router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.status(200).json({
      success: true,
      msg: "You are successfully authenticated to this route!",
    });
  }
);

router.get(
  "/feed",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const tweets = await userService.getFeed(req.user);
      res.status(200).json(tweets);
    } catch (error) {
      res.status(401).json({ message: error });
    }
  }
);
router.get(
  "/myFeed",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const tweets = await userService.getFeedByUserId(req.user._id);
      res.status(200).json(tweets);
    } catch (error) {
      res.status(401).json({ message: error });
    }
  }
);
router.post(
  "/post/tweet",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const tweet = {
        tweet: req.body.tweet,
        user: req.user.username,
      };
      const result = await userService.postTweet(tweet, req.user);
      res.status(200).json({ success: true, msg: "Tweet is successful" });
    } catch (error) {
      res.status(401).json({ success: false, msg: "Tweet is unsuccessful" });
    }
  }
);

router.post(
  "/follow",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const result = await userService.follow(req.body.followId, req.user._id);
      res.status(200).json({ success: true, msg: "follow successful" });
    } catch (error) {
      res.status(401).json({ success: false, msg: "follow unsuccessful" });
    }
  }
);

router.post(
  "/unfollow",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const result = await userService.unfollow(
        req.body.unfollowId,
        req.user._id
      );
      res.status(200).json({ success: true, msg: "unfollow successful" });
    } catch (error) {
      res.status(401).json({ success: false, msg: "unfollow unsuccessful" });
    }
  }
);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const profile = await userService.getProfile(req.user._id);
      res.status(200).json({ success: true, profile });
    } catch (error) {
      res.status(401).json({ success: false, msg: "Unable to get Profile" });
    }
  }
);

router.get(
  "/allUsers",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ success: true, users });
    } catch (error) {
      res.status(401).json({ success: false, msg: "Unable to get users" });
    }
  }
);

module.exports = router;
