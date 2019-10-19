import { Schema, model } from "mongoose";
import User from "./user";
import { checkExistenceInDatabase } from "../util";

const communitySchema = new Schema({
  name: {
    type: String,
    index: {
      unique: true,
      collation: { locale: "en", strength: 2 }
    },
    trim: true,
    required: [true, "Community name required"]
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Creator of community required"],
    validate: {
      validator: user_id => checkExistenceInDatabase(User, user_id),
      message: "The user does not exist"
    }
  },
  description: {
    type: String,
    trim: true,
    required: [true, "You need to describe your community"]
  },
  tags: [{ type: String, trim: true }],
  members: {
    type: Number,
    default: 0
  }
});

export default model("Community", communitySchema);
