const userModel = require("../models/users");

const userService = {};

userService.register = async (user) => {
  const isUserExist = await userModel.findUser(user.username);
  if (!isUserExist) {
    const username = await userModel.registerUser(user);
    return username;
  } else {
    const err = new Error("User already exists");
    err.status = 401;
    throw err;
  }
};
userService.login = async (user) => {
  const isUserExist = await userModel.findUser(user.username);

  if (isUserExist) {
    const _id = await userModel.login(user);
    if (_id) {
      return _id;
    } else {
      const err = new Error("Username or password is not correct");
      err.status = 401;
      throw err;
    }
  } else {
    const err = new Error("User not found");
    err.status = 401;
    throw err;
  }
};

userService.findUserById = async (_id) => {
  const user = await userModel.findUserById(_id);
  return user;
};

userService.getFeed = async (user) => {
  const feed = await userModel.getFeed(user);
  // console.log(feed);
  let result = [];
  for (let i = 0; i < feed.length; i++) {
    // console.log(feed[i].tweets);
    result = result.concat(feed[i].tweets);
  }
  // console.log(result);
  return result;
};

userService.getFeedByUserId = async (userId) => {
  const feed = await userModel.getFeedByUserId(userId);
  return feed;
};

userService.postTweet = async (tweet, user) => {
  tweet.tweetId = await userModel.generateTweetId(user);

  const tweetId = await userModel.postTweet(tweet, user);
  return tweetId;
  // return tweet;
};
userService.follow = async (followId, userId) => {
  const follow = await userModel.follow(followId, userId);
  return follow;
};
userService.unfollow = async (unfollowId, userId) => {
  const follow = await userModel.unfollow(unfollowId, userId);
  return follow;
};
userService.getProfile = async (userId) => {
  const profile = await userModel.getProfile(userId);
  return profile;
};

userService.getAllUsers = async () => {
  const users = await userModel.getAllUsers();
  return users;
};

module.exports = userService;
