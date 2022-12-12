const mongoose = require("mongoose");
const moment = require("moment");
const url = "mongodb://localhost:27017/tweetUp";

mongoose.set("strictQuery", false);
mongoose.connect(url);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  location: {
    type: String,
  },
  bio: { type: String },
  dateOfJoining: {
    type: String,
    default: moment().format("LL"),
  },
  tweets: [
    {
      user: {
        type: String,
        required: true,
      },
      tweetId: {
        type: Number,
        required: true,
      },
      tweet: {
        type: String,
        required: true,
      },
      dateOfTweet: {
        type: String,
        default: moment().format("LLLL"),
      },
    },
  ],
  follows: {
    type: [String],
  },
  followedBy: {
    type: [String],
  },
});

const ecommerceDb = {};
ecommerceDb.getUserCollection = async () => {
  return await mongoose.model("users", userSchema);
};

module.exports = ecommerceDb;
