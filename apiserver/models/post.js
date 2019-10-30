import { Schema, model } from "mongoose";
import User from "./user";
import Community from "./community";
import PostVote from "./postVote";
import Comment from "./comment";
import { checkExistenceInDatabase, removeDependentDocs } from "../util";
import { log } from "util";

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
      validator: community_id => checkExistenceInDatabase(Community, community_id),
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
});

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ community: 1, createdAt: -1 });

postSchema.post("remove", async function() {
  console.log("Inside Post remove middleware");
  await removeDependentDocs(Comment, { post: this._id });
  await PostVote.deleteMany({ post: this._id }).exec();
});

export default model("Post", postSchema);
