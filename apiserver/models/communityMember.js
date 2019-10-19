import { Schema, model } from "mongoose";

import User from "./user";
import Community from "./community";

import { checkExistenceInDatabase } from "../util";

const communityMemberSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  member: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    validate: {
      validator: member_id => checkExistenceInDatabase(User, member_id),
      message: "The user does not exist"
    }
  },
  community: {
    type: Schema.Types.ObjectId,
    ref: "Community",
    index: true,
    validate: {
      validator: community_id =>
        checkExistenceInDatabase(Community, community_id),
      message: "The community does not exist"
    }
  }
});

export default model("CommunityMember", communityMemberSchema);
