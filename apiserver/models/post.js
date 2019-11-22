import { Schema, model } from "mongoose";
import User from "./user";
import Community from "./community";
import PostVote from "./postVote";
import Comment from "./comment";
import { removeDependentDocs, makeHash } from "../util";
import CustomError from "../util/CustomError";

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
  hash: {
    type: String,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  editedAt: Date,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User for post required"],
    validate: {
      validator: author_id => User.exists({ _id: author_id }),
      message: "User does not exist"
    }
  },
  community: {
    type: Schema.Types.ObjectId,
    ref: "Community",
    required: [true, "Community for post required"],
    validate: {
      validator: community_id => Community.exists({ _id: community_id }),
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

postSchema.pre("save", async function() {
  if (this.isModified("title content")) {
    this.editedAt = new Date();
    const obj = { author: this.author, title: this.title, content: this.content, community: this.community };
    this.hash = makeHash(obj);
    if (isSpam(this.hash))
      throw new CustomError(400, "You posted the same post already. Check out your posts of the past!");
  }
});

postSchema.post("remove", async function() {
  console.log("Inside Post remove middleware");
  await removeDependentDocs(Comment, { post: this._id });
  await PostVote.deleteMany({ post: this._id }).exec();
});

export default model("Post", postSchema);
