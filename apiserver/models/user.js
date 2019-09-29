import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true
  },
  email: {
    type: String,
    index: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community"
    }
  ],
  karma: {
    type: Number,
    default: 1
  }
  // TODO: Password is missing
});

export default mongoose.model("User", userSchema);
