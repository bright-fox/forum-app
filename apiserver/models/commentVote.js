import { Schema, model } from "mongoose";
import Comment from "./comment";
import Post from "./post";
import User from "./user";

import { checkExistenceInDatabase, updateParentField } from "../util";

const commentVoteSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  vote: {
    type: Number,
    required: true,
    validate: {
      validator: num => num === -1 || num === 1,
      message: "Vote not valid"
    }
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
    validate: {
      validator: comment_id => checkExistenceInDatabase(Comment, comment_id),
      message: "Comment does not exist"
    }
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: user_id => checkExistenceInDatabase(User, user_id),
      message: "User does not exist"
    }
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
    validate: {
      validator: post_id => checkExistenceInDatabase(Post, post_id),
      message: "Post does not exist"
    }
  }
});

commentVoteSchema.index({ user: 1, vote: -1, createdAt: -1 });
commentVoteSchema.index({ comment: 1, user: 1 });

commentVoteSchema.pre("save", async function() {
  await updateParentField(Comment, this.comment, "upvotes", this.vote);
  const comment = await Comment.findById(this.comment);
  if (this.vote === 1) await updateParentField(User, comment.author, "karma", 2);
});

commentVoteSchema.post("remove", async function() {
  await updateParentField(Comment, this.comment, "upvotes", this.vote * -1);
  const comment = await Comment.findById(this.comment);
  if (this.vote === 1) await updateParentField(User, comment.author, "karma", -2);
});

export default model("CommentVote", commentVoteSchema);
