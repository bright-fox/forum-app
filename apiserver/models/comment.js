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
  upvotes: Integer
});

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });

export default model("Comment", commentSchema);
