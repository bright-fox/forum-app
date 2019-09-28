import { Schema, model } from "mongoose";

const commentVoteModel = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  vote: Number,
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    index: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true
  }
});

export default model("CommentVote", commentVoteModel);
