import { Schema, model } from "mongoose";
import Post from "./post";
import User from "./user";
import { checkExistenceInDatabase } from "../util";

const postVoteModel = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  vote: Number,
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    index: true,
    validate: {
      validator: post_id => checkExistenceInDatabase(Post, post_id),
      message: "Post does not exist"
    }
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    validate: {
      validator: user_id => checkExistenceInDatabase(User, user_id),
      message: "User does not exist"
    }
  }
});

postVoteModel.index({ user: 1, vote: -1, createdAt: -1 });

export default model("PostVote", postVoteModel);
