import { Schema, model } from "mongoose";

const commentSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  content: String,
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post"
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  upvotes: Number
});

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });

export default model("Comment", commentSchema);
