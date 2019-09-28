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
  Description: String,
  tags: [String],
  members: Number
});

export default mongoose.model("Community", communitySchema);
