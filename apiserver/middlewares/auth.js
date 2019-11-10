import jwt from "jsonwebtoken";
import CustomError from "../util/CustomError";
import { checkDocOwnership, asyncHandler } from "../util";
import Post from "../models/post";
import Community from "../models/community";
import CommunityMember from "../models/communityMember";
import PostVote from "../models/postVote";

export const authenticateIdToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return next(new CustomError(401));

  jwt.verify(token, process.env.ID_TOKEN_SECRET, (err, user) => {
    if (err) return next(new CustomError(403, "The id token is invalid"));
    req.user = user;
    next();
  });
};

export const checkCommunityOwnership = asyncHandler(async (req, res, next) => {
  await checkDocOwnership(Community, req.params.community_id, req.user.id, "creator");
  next();
});

export const checkCommunityMemberOwnership = asyncHandler(async (req, res, next) => {
  await checkDocOwnership(CommunityMember, req.params.communitymember_id, req.user.id, "member");
  next();
});

export const checkCommunityMembership = asyncHandler(async (req, res, next) => {
  const communityMember = await CommunityMember.findOne({ member: req.user.id, community: req.body.community }).exec();
  if (!communityMember) throw new CustomError(404, "You need to be a member of the community to post");
  next();
});

export const checkPostOwnership = asyncHandler(async (req, res, next) => {
  await checkDocOwnership(Post, req.params.post_id, req.user.id, "author");
  next();
});

export const checkPostVoteOwnership = asyncHandler(async (req, res, next) => {
  await checkDocOwnership(PostVote, req.params.postVote_id, req.user.id, "user");
  next();
});
