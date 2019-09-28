import { Schema, model } from "mongoose";

const postVoteModel = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  vote: Number,
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    index: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

postVoteModel.index({ user: 1, vote: -1, createdAt: -1 });

export default model("PostVote", postVoteModel);
