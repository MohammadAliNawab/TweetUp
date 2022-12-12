const db = require("../utilities/connection");
const bcrypt = require("bcrypt");
const userModel = {};

userModel.generateTweetId = async (user) => {
  const model = await db.getUserCollection();
  const ids = await model.distinct("tweets.tweetId", { _id: user._id });
  if (ids.length > 0) return Math.max(...ids) + 1;
  else return 1;
};

userModel.findUser = async (username) => {
  // Logic to find user in db and if it is present return username otherwise return null
  const model = await db.getUserCollection();
  const data = await model.findOne({ username });
  return data;
};

userModel.registerUser = async (user) => {
  const model = await db.getUserCollection();
  bcrypt.hash(user.password, 10, async (err, result) => {
    user.password = result;
    return await model.create(user);
  });
};

userModel.login = async (user) => {
  const model = await db.getUserCollection();
  const data = await model.findOne({ username: user.username });
  if (!data) return null;
  if (bcrypt.compareSync(user.password, data.password)) return data._id;
};
userModel.findUserById = async (_id) => {
  const model = await db.getUserCollection();
  const user = await model.findOne({ _id });
  return user;
};

userModel.postTweet = async (tweet, user) => {
  const model = await db.getUserCollection();
  const tweets = await model.updateOne(
    { _id: user._id },
    { $push: { tweets: tweet } }
  );
};
userModel.getFeed = async (user) => {
  const model = await db.getUserCollection();
  const tweets = await model.find(
    { _id: { $in: [...user.follows, user._id] } },
    { _id: 0, tweets: 1 }
  );
  // console.log(tweets);

  return tweets;
};

userModel.getFeedByUserId = async (userId) => {
  const model = await db.getUserCollection();
  const feed = await model.findOne({ _id: userId }, { _id: 0, tweets: 1 });
  // console.log(feed);
  return feed.tweets;
};
userModel.follow = async (followId, userId) => {
  const model = await db.getUserCollection();
  const follow = await model.updateOne(
    { _id: userId },
    { $push: { follows: followId } }
  );
  return follow;
};
userModel.unfollow = async (unfollowId, userId) => {
  const model = await db.getUserCollection();
  const unfollow = await model.updateOne(
    { _id: userId },
    { $pull: { follows: unfollowId } }
  );
  return unfollow;
};
userModel.getProfile = async (userId) => {
  const model = await db.getUserCollection();
  const profile = await model.findOne({ _id: userId }, { _id: 1, password: 0 });
  return profile;
};

userModel.getAllUsers = async () => {
  const model = await db.getUserCollection();
  const users = await model.find({}, { _id: 1, bio: 1, username: 1 });
  return users;
};
module.exports = userModel;
