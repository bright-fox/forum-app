import mongoose from "mongoose";
import Community from "./community";
import { checkExistenceInDatabase } from "../util";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    index: {
      unique: true,
      collation: { locale: "en", strength: 2 }
    },
    trim: true,
    required: [true, "You need to enter an username"]
  },
  email: {
    type: String,
    index: true,
    unique: true,
    trim: true,
    required: [true, "You need to enter an email"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      validate: {
        validator: community_id =>
          checkExistenceInDatabase(Community, community_id),
        message: "Community does not exist"
      }
    }
  ],
  karma: {
    type: Number,
    default: 1
  }
  // TODO: Password is missing
});

export default mongoose.model("User", userSchema);
