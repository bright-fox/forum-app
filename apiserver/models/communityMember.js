import { Schema, model } from "mongoose";

import User from "./user";
import Community from "./community";

import { checkExistenceInDatabase, updateParentField } from "../util";

const communityMemberSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  member: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
      validator: community_id => checkExistenceInDatabase(Community, community_id),
      message: "The community does not exist"
    }
  }
});

communityMemberSchema.index({ member: 1, community: 1 }, { unique: true });

communityMemberSchema.pre("save", async function() {
  await updateParentField(Community, this.community, { members: 1 });
});

communityMemberSchema.post("remove", async function() {
  await updateParentField(Community, this.community, { members: -1 });
});

export default model("CommunityMember", communityMemberSchema);
