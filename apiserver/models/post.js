import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community"
  },
  upvotes: Number,
  comments: Number
  // popular: {
  //   type: Boolean,
  //   default: false
  // }
});

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ community: 1, createdAt: -1 });

export default mongoose.model("Post", postSchema);
