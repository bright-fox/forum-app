import { Schema, model } from "mongoose";
import Post from "./post";
import User from "./user";
import CommentVote from "./commentVote";
import CustomError from "../util/CustomError";
import { updateParentField, isSpam, makeHash } from "../util";

const commentSchema = new Schema({
  createdAt: Date,
  editedAt: Date,
  content: {
    type: String,
    trim: true,
    required: [true, "The comment is empty"]
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    validate: {
      validator: post_id => Post.exists({ _id: post_id }),
      message: "Post does not exist"
    }
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    validate: {
      validator: author_id => User.exists({ _id: author_id }),
      message: "User does not exist"
    }
  },
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    validate: {
      validator: async function(comment_id) {
        return await this.constructor.exists({ _id: comment_id });
      },
      message: "The comment does not exist"
    }
  },
  upvotes: {
    type: Number,
    default: 0
  },
  hash: {
    type: String,
    index: true,
    select: false
  }
});

commentSchema.index({ post: 1, replyTo: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });

commentSchema.pre("save", async function() {
  const date = new Date();
  if (this.isNew) {
    this.createdAt = date;
    updateParentField(Post, this.post, "comments", 1);
  }
  if (this.isModified("content")) {
    this.editedAt = date;
    const obj = { author: this.author, content: this.content, post: this.post, replyTo: this.replyTo || "" };
    this.hash = makeHash(obj);
    if (await isSpam(this.constructor, this.hash))
      throw new CustomError(400, "You posted the same comment already. Check out your comments of the past!");
  }
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
