import mongoose from "mongoose";

import Post from "./post";
import Comment from "./comment";
import Community from "./community";
import PostVote from "./postVote";
import CommentVote from "./commentVote";
import CommunityMember from "./CommunityMember";

import { checkExistenceInDatabase, removeDependentDocs } from "../util";
import { runInNewContext } from "vm";
import { log } from "util";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    index: {
      unique: true,
      collation: { locale: "en", strength: 2 }
    },
    trim: true,
    required: [true, "You need to enter an username"]
  },
  email: {
    type: String,
    index: true,
    unique: true,
    trim: true,
    required: [true, "You need to enter an email"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  karma: {
    type: Number,
    default: 1
  }
  // TODO: Password is missing
});

userSchema.post("remove", async function() {
  removeDependentDocs(CommentVote, { user: this._id });
  removeDependentDocs(PostVote, { user: this._id });
  removeDependentDocs(Comment, { author: this._id });
  removeDependentDocs(Post, { author: this._id });
  removeDependentDocs(CommunityMember, { member: this._id });
  removeDependentDocs(Community, { creator: this._id });
});

export default mongoose.model("User", userSchema);
