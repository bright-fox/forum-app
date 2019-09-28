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
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community"
    }
  ],
  karma: Number
  // TODO: Password is missing
});

export default mongoose.model("User", userSchema);
