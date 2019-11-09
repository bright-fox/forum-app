import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre("save", async function() {
  console.log("INSIDE SAVE USER MIDDLEWARE");
  if (this.isModified("password")) {
    console.log("PASSWORD HAS CHANGED OR CREATED");
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.post("remove", async function() {
  await removeDependentDocs(CommentVote, { user: this._id });
  await removeDependentDocs(PostVote, { user: this._id });
  await removeDependentDocs(Comment, { author: this._id });
  await removeDependentDocs(Post, { author: this._id });
  await removeDependentDocs(CommunityMember, { member: this._id });
  await removeDependentDocs(Community, { creator: this._id });
});

export default mongoose.model("User", userSchema);
