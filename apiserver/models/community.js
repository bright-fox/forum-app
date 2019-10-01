import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  description: String,
  tags: [String],
  members: {
    type: Number,
    default: 0
  }
});

export default mongoose.model("Community", communitySchema);
