import { Schema, model } from "mongoose";
import Post from "./post";
import User from "./user";
import { updateParentField } from "../util";

const postVoteSchema = new Schema({
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
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
    validate: {
      validator: post_id => Post.exists({ _id: post_id }),
      message: "Post does not exist"
    }
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: user_id => User.exists({ _id: user_id }),
      message: "User does not exist"
    }
  }
});

postVoteSchema.index({ post: 1, user: 1 });
postVoteSchema.index({ user: 1, vote: -1, createdAt: -1 });

postVoteSchema.pre("save", async function() {
  await updateParentField(Post, this.post, "upvotes", this.vote);
  const post = await Post.findById(this.post);
  if (this.vote === 1) await updateParentField(User, post.author, "karma", 3);
});

postVoteSchema.post("remove", async function() {
  await updateParentField(Post, this.post, "upvotes", this.vote * -1);
  const post = await Post.findById(this.post);
  if (this.vote === 1) await updateParentField(User, post.author, "karma", -3);
});

export default model("PostVote", postVoteSchema);
