import { Schema, model } from "mongoose";
import User from "./user";
import Post from "./post";
import CommunityMember from "./communityMember";
import { checkExistenceInDatabase, removeDependentDocs } from "../util";

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
    index: true,
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
  //tags: [{ type: String, trim: true }],
  members: {
    type: Number,
    default: 0
  }
});

communitySchema.post("remove", async function() {
  await removeDependentDocs(Post, { community: this._id });
  await CommunityMember.deleteMany({ community: this._id }).exec();
});

export default model("Community", communitySchema);
