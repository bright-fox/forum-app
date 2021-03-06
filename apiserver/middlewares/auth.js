import jwt from "jsonwebtoken";
import CustomError from "../util/CustomError";
import { checkValidationErrors, checkDocOwnership, asyncHandler } from "../util";
import Post from "../models/post";
import Community from "../models/community";
import CommunityMember from "../models/communityMember";
import PostVote from "../models/postVote";
import Comment from "../models/comment";
import CommentVote from "../models/commentVote";
import User from "../models/user";
import RefreshToken from "../models/refreshtoken";

export const authenticateIdToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return next(new CustomError(401, "You did not pass an id token"));

  jwt.verify(token, process.env.ID_TOKEN_SECRET, (err, user) => {
    if (err) return next(new CustomError(403, "The id token is invalid"));
    req.user = user;
    next();
  });
};

export const authenticateRefreshToken = async (req, res, next) => {
  if (checkValidationErrors(req)) return next(new CustomError(400, "Validation failed"));
  const token = await RefreshToken.findOne({ token: req.body.refreshToken }).exec();
  if (!token) return next(new CustomError(404));

  jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err) return next(new CustomError(401, "The token is invalid"));

    req.user = user;
    req.token = token;
    next();
  });
};

export const checkCommunityOwnership = asyncHandler(async (req, res, next) => {
  await checkDocOwnership(req, Community, req.params.community_id, req.user.id, "creator");
  next();
});

export const checkCommunityMemberOwnership = asyncHandler(async (req, res, next) => {
  await checkDocOwnership(req, CommunityMember, req.params.member_id, req.user.id, "member");
  next();
});

export const checkCommunityOwnerOrMember = asyncHandler(async (req, res, next) => {
  const isCreator = await Community.exists({ _id: req.body.community, creator: req.user.id });
  const isMember = await CommunityMember.exists({ member: req.user.id, community: req.body.community });
  if (!isCreator && !isMember) throw new CustomError(404, "You need to be a member of the community to post");
  next();
});

export const checkPostOwnership = asyncHandler(async (req, res, next) => {
  await checkDocOwnership(req, Post, req.params.post_id, req.user.id, "author");
  next();
});

export const checkPostVoteOwnership = asyncHandler(async (req, res, next) => {
  await checkDocOwnership(req, PostVote, req.params.vote_id, req.user.id, "user");
  next();
});

export const checkCommentOwnership = asyncHandler(async (req, res, next) => {
  await checkDocOwnership(req, Comment, req.params.comment_id, req.user.id, "author");
  if (req.doc.isDeleted) throw new CustomError(404);
  next();
});

export const checkCommentVoteOwnership = asyncHandler(async (req, res, next) => {
  await checkDocOwnership(req, CommentVote, req.params.vote_id, req.user.id, "user");
  next();
});

export const checkUserOwnership = asyncHandler(async (req, res, next) => {
  await checkDocOwnership(req, User, req.params.user_id, req.user.id, "_id");
  next();
});
