import mongoose, { models } from "mongoose";
import bcrypt from "bcrypt";

import Post from "./post";
import Comment from "./comment";
import Community from "./community";
import PostVote from "./postVote";
import CommentVote from "./commentVote";
import Refreshtoken from "./refreshtoken";
import CommunityMember from "./CommunityMember";

import { removeDependentDocs, deleteComment } from "../util";

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
    select: false,
    required: [true, "You need to enter an email"]
  },
  gender: {
    type: String,
    required: [true, "You need to select a gender"]
  },
  biography: {
    type: String,
    trim: true
  },
  createdAt: Date,
  editedAt: Date,
  karma: {
    type: Number,
    default: 1
  },
  password: {
    type: String,
    required: true,
    select: false
  }
});

userSchema.pre("save", async function() {
  const date = new Date();

  if (this.isNew) this.createdAt = date;
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    await removeDependentDocs(Refreshtoken, { user: this._id });
  }
  if (this.isModified("username")) await removeDependentDocs(Refreshtoken, { user: this._id });
  if (this.isModified("biography")) this.editedAt = date;
});

userSchema.post("remove", async function() {
  await Refreshtoken.deleteMany({ user: this._id }).exec();
  await removeDependentDocs(Community, { creator: this._id });
  await removeDependentDocs(Post, { author: this._id });
  const comments = await Comment.find({ author: this._id, isDeleted: false }).exec();
  comments.forEach(async comment => {
    await deleteComment(comment);
  });
  await removeDependentDocs(PostVote, { user: this._id });
  await removeDependentDocs(CommentVote, { user: this._id });
  await removeDependentDocs(CommunityMember, { member: this._id });
});

export default models.User || mongoose.model("User", userSchema);
