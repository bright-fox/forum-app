import { Schema, model } from "mongoose";
import Comment from "./comment";
import { checkExistenceInDatabase } from "../util";

const commentVoteModel = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  vote: Number,
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    index: true,
    validate: {
      validator: comment_id => checkExistenceInDatabase(Comment, comment_id),
      message: "Comment does not exist"
    }
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    validate: {
      validator: user_id => checkExistenceInDatabase(User, user_id),
      message: "User does not exist"
    }
  }
});

export default model("CommentVote", commentVoteModel);
