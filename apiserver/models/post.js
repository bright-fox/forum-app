import { Schema, model } from "mongoose";
import User from "./user";
import Community from "./community";
import { checkExistenceInDatabase } from "../util";

const postSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Title for post required"]
  },
  content: {
    type: String,
    trim: true,
    required: [true, "Content for post required"]
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User for post required"],
    validate: {
      validator: author_id => checkExistenceInDatabase(User, author_id),
      message: "User does not exist"
    }
  },
  community: {
    type: Schema.Types.ObjectId,
    ref: "Community",
    required: [true, "Community for post required"],
    validate: {
      validator: community_id =>
        checkExistenceInDatabase(Community, community_id),
      message: "Community does not exist"
    }
  },
  upvotes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  }
  // popular: {
  //   type: Boolean,
  //   default: false
  // }
});

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ community: 1, createdAt: -1 });

export default model("Post", postSchema);
