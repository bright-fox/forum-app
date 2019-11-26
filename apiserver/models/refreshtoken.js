import { Schema, model, models } from "mongoose";

const refreshtokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    index: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800 // expires in 7 days
  }
});

export default models.Refreshtoken || model("Refreshtoken", refreshtokenSchema);
