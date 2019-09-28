import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community"
  },
  upvotes: Integer
});

export default mongoose.model("Post", postSchema);
