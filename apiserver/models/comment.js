import { Schema, model } from "mongoose";
import Post from "./post";
import User from "./user";
import CommentVote from "./commentVote";

import { checkExistenceInDatabase, updateParentField } from "../util";

const commentSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    trim: true,
    required: [true, "The comment is empty"]
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    validate: {
      validator: post_id => checkExistenceInDatabase(Post, post_id),
      message: "Post does not exist"
    }
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    validate: {
      validator: author_id => checkExistenceInDatabase(User, author_id),
      message: "User does not exist"
    }
  },
  upvotes: {
    type: Number,
    default: 0
  }
});

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });

commentSchema.pre("save", async function() {
  if (this.isNew) updateParentField(Post, this.post, "comments", 1);
  if (this.upvotes < 0) this.upvotes = 0;
});

commentSchema.post("deleteOne", async function() {
  console.log("DeleteOne Post Middleware");
  const { _id, post } = this.getQuery();

  await updateParentField(Post, this.post, "comments", -1);
  await CommentVote.deleteMany({ comment: this._id }).exec();
});

// TODO: Check if comment is 0
commentSchema.post("remove", async function() {
  console.log("Remove Post Middleware");
  await CommentVote.deleteMany({ comment: this._id }).exec();
});

export default model("Comment", commentSchema);
