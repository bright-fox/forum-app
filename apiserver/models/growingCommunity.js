import { Schema, model, models } from "mongoose";

const growingCommunitySchema = new Schema({
  community: {
    type: Schema.Types.ObjectId,
    ref: "Community"
  },
  rank: Number,
  count: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

growingCommunitySchema.index({ createdAt: -1 });

export default models.GrowingCommunity || model("GrowingCommunity", growingCommunitySchema);
