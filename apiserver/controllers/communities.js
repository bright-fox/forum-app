import express from "express";
import Community from "../models/community";
import CommunityMember from "../models/communityMember";
import Post from "../models/post";

import { validateCreateCommunity, validateUpdateCommunity } from "../middlewares/validation";
import { checkValidationErrors, asyncHandler } from "../util";
import CustomError from "../util/CustomError";

const router = express.Router();

//prettier-ignore
router.get("/", asyncHandler(async (req, res) => {
  const communities = await Community.find({}).lean().exec();
  res.status(200).json(communities);
}));

//prettier-ignore
router.post("/", validateCreateCommunity(), asyncHandler(async (req, res) => {
  const { name, creator, description } = req.body;
  if (checkValidationErrors(req)) throw new CustomError(400);

  const community = new Community({ name, creator, description });
  const createdCommunity = await community.save();
  res.status(200).json(createdCommunity);
}));

//prettier-ignore
router.get("/:community_id", asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.community_id).lean().exec();
  if (!community) throw new CustomError(404, "No community found");
  res.status(200).json(community);
}));

//prettier-ignore
router.put("/:community_id", validateUpdateCommunity(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);

  const community = await Community.findById(req.params.community_id).exec();
  if (!community) throw new CustomError(404, "No community found to be updated");
  const { name, description } = req.body;

  community.name = name || community.name;
  community.description = description || community.description;

  const updatedCommunity = await community.save();
  res.status(200).json(updatedCommunity);
}));

//prettier-ignore
router.delete("/:community_id", asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.community_id).exec();
  if (!community) throw new CustomError(404, "No community found to be deleted");

  await community.remove();
  res.status(200).json(req.params.community_id);
}));

//prettier-ignore
router.get("/:community_id/posts", asyncHandler(async (req, res) => {
  const posts = await Post.find({ community: req.params.community_id }).lean().exec();
  if (posts.length <= 0) throw new CustomError(404, "No posts for this community found");
  res.status(200).json(posts);
}));

//prettier-ignore
router.post("/:community_id/communitymember", asyncHandler(async (req, res) => {
  const { user } = req.body;
  const communityMember = new CommunityMember({user, community: req.params.community_id});

  const createdCommunityMember = await communityMember.save();
  res.status(200).json(createdCommunityMember);
}));

//prettier-ignore
router.delete("/:community_id/communitymember/:communitymember_id", asyncHandler(async (req, res) => {
  const communityMember = await CommunityMember.findById(req.params.communitymember_id).exec();
  if (!communityMember) throw new CustomError(404, "No Communitymember found to be deleted");

  await communityMember.remove();
  res.status(200).json(req.params.communitymember_id);
}));

export default router;
