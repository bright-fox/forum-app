import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  created_at: {
    type: Date,
    default: Date.now
  }
  // author
  // comments
});

export default mongoose.model("Post", postSchema);
