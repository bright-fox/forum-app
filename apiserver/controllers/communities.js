import express from "express";
import Community from "../models/community";
import CommunityMember from "../models/communityMember";
import Post from "../models/post";

import { validateCommunity, validatePage } from "../middlewares/validation";
import { authenticateIdToken, checkCommunityOwnership, checkCommunityMemberOwnership } from "../middlewares/auth";
import { checkValidationErrors, asyncHandler } from "../util";
import CustomError from "../util/CustomError";

const router = express.Router();

//prettier-ignore
router.get("/page/:p", validatePage(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);
  const limit = 20;
  const maxPage = await checkPageUnderMax(Community, {}, limit, req.params.p);

  const communities = await Community.find({}).skip((req.params.p * limit) - limit)
  .limit(limit).lean().exec();
  if(communities.length <= 0) throw new CustomError(404, "There are no communities yet!");
  res.status(200).json({communities, currentPage: req.params.p, maxPage});
}));

//prettier-ignore
router.post("/", authenticateIdToken, validateCommunity(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);
  const { name, description } = req.body;
  const community = new Community({ name, creator: req.user.id, description });
  const createdCommunity = await community.save();
  res.status(200).json({success: "You successfully created a community!", createdCommunity});
}));

//prettier-ignore
router.get("/:community_id", asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.community_id).lean().exec();
  if (!community) throw new CustomError(404, "No community found");
  res.status(200).json(community);
}));

//prettier-ignore
router.put("/:community_id", authenticateIdToken, checkCommunityOwnership, validateCommunity(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);
  const { doc } = req;
  const { name, description } = req.body;

  doc.name = name;
  doc.description = description;

  await doc.save();
  res.status(200).json({success: "You successfully updated your community"});
}));

//prettier-ignore
router.delete("/:community_id", authenticateIdToken, checkCommunityOwnership, asyncHandler(async (req, res) => {
  await req.doc.remove();
  res.status(200).json({success: "You successfully deleted the community!", docId: req.params.community_id});
}));

//prettier-ignore
router.get("/:community_id/posts/page/:p", validatePage(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);
  const limit = 30;
  const maxPage = await checkPageUnderMax(Post, { community: req.params.community_id }, limit, req.params.p);

  const posts = await Post.find({ community: req.params.community_id }).skip((req.params.p * limit) - limit)
  .limit(limit).lean().exec();
  if (posts.length <= 0) throw new CustomError(404, "No posts for this community found");
  res.status(200).json({posts, currentPage: req.params.p, maxPage});
}));

//prettier-ignore
router.post("/:community_id/communitymember", authenticateIdToken, asyncHandler(async (req, res) => {
  const { id } = req.user;
  const communityMember = new CommunityMember({member: id, community: req.params.community_id});

  const createdCommunityMember = await communityMember.save();
  res.status(200).json({success: "You successfully joined the community!"});
}));

//prettier-ignore
router.delete("/:community_id/communitymember/:communitymember_id", authenticateIdToken, 
  checkCommunityMemberOwnership, asyncHandler(async (req, res) => {
  await req.doc.remove();
  res.status(200).json({docId: req.params.communitymember_id});
}));

export default router;
