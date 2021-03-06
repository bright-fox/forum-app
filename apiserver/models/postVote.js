import { Schema, model, models } from "mongoose";
import _ from "lodash";
import Post from "./post";
import User from "./user";
import { updateParentField } from "../util";
import { karmaPerPostVote } from "../util/variables";

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

postVoteSchema.pre("save", async function () {
  const voteInc = this.isNew ? this.vote : this.vote * 2;
  const post = await updateParentField(Post, this.post, "upvotes", voteInc);
  if (!_.isEqual(this.user, post.author)) await updateParentField(User, post.author, "karma", this.vote * karmaPerPostVote);
});

postVoteSchema.post("remove", async function () {
  const post = await updateParentField(Post, this.post, "upvotes", this.vote * -1);
  if (!_.isEqual(this.user, post.author)) await updateParentField(User, post.author, "karma", this.vote * karmaPerPostVote * -1);
});

export default models.PostVote || model("PostVote", postVoteSchema);
