import express from "express";
import bcrypt from "bcrypt";
import _ from "lodash";

import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";
import CommunityMember from "../models/communityMember";

import { generateIdToken, generateRefreshToken } from "../util";
import { validateUser, validateUsername, validatePassword, validatePage } from "../middlewares/validation";
import { authenticateIdToken, checkUserOwnership } from "../middlewares/auth";
import { checkValidationErrors, asyncHandler, checkPageUnderMax } from "../util";
import CustomError from "../util/CustomError";

const router = express.Router();

//prettier-ignore
router.get("/:user_id", asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.user_id).lean().exec();
  if (!user) throw new CustomError(404, "No user found");
  res.status(200).json(user);
}));

// general info update for user
//prettier-ignore
router.put("/:user_id", authenticateIdToken, checkUserOwnership, 
  validateUser(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);
  const { doc } = req;

  doc.biography = req.body.biography;
  const updatedUser = await doc.save();

  res.status(200).json({success: "You succesfully updated your profile!",
    user: _.omit(updatedUser.toJSON(), "password", "email")});
}));

//prettier-ignore
router.put("/:user_id/username", authenticateIdToken, checkUserOwnership, 
  validateUsername(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);
  const { doc } = req;

  doc.username = req.body.username;
  const updatedUser = await doc.save();

  const payload = { username: updatedUser.username, id: updatedUser._id };
  const idToken = generateIdToken(payload);
  const refreshToken = await generateRefreshToken(payload, updatedUser._id);

  res.status(200).json({success: "You succesfully updated your username!",
  user: _.omit(updatedUser.toJSON(), "password", "email"), idToken, refreshToken});
}));

//prettier-ignore
router.put("/:user_id/password", authenticateIdToken, checkUserOwnership, 
  validatePassword(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);

  const user = await User.findById(req.user.id).select("+password").exec();
  if (!user) throw new CustomError(404, "No user found to be updated");

  const { oldPassword, newPassword } = req.body;
  const passwordValid = await bcrypt.compare(oldPassword, user.password);
  if(!passwordValid) throw new CustomError(400, "Wrong password");

  user.password = newPassword;
  const updatedUser = await user.save();

  const payload = { username: updatedUser.username, id: updatedUser._id };
  const idToken = generateIdToken(payload);
  const refreshToken = await generateRefreshToken(payload, updatedUser._id);

  res.status(200).json({success: "You succesfully updated your password!", idToken, refreshToken});
}));

//prettier-ignore
router.delete("/:user_id", authenticateIdToken, checkUserOwnership, asyncHandler(async (req, res) => {
  await req.doc.remove();
  res.status(200).json({success: "You successfully deleted your account!", docId: req.params.user_id});
}));

//prettier-ignore
router.get("/:user_id/private", authenticateIdToken, checkUserOwnership, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.user_id).select("+email").lean().exec();
  if (!user) throw new CustomError(404, "No user found");
  res.status(200).json(user);
}));

//prettier-ignore
router.get("/:user_id/home/page/:p", authenticateIdToken, checkUserOwnership,
  validatePage(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);
  const limit = 30;
  const maxPage = await checkPageUnderMax(Post, { community: { $in: req.doc.communities }}, limit, req.params.p);
  const posts = await Post.find({ community: { $in: req.doc.communities }}).skip((req.params.p * limit) - limit)
    .limit(limit).lean().exec();
  if (posts.length <= 0) throw new CustomError(404, "You did not join any communities to see their posts!");
  res.status(200).json({posts, maxPage, currentPage: req.params.p});
}));

//prettier-ignore
router.get("/:user_id/posts/page/:p", validatePage(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);
  const limit = 10;
  const maxPage = await checkPageUnderMax(Post, { author: req.params.user_id }, limit, req.params.p);
  const posts = await Post.find({ author: req.params.user_id }).skip((req.params.p * limit) - limit)
  .limit(limit).lean().exec();
  if (posts.length <= 0) throw new CustomError(404, "You did not write any posts!");
  res.status(200).json({posts, maxPage, currentPage: req.params.p});
}));

//prettier-ignore
router.get("/:user_id/comments/page/:p", validatePage(), asyncHandler(async(req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);
  const limit = 10;
  const maxPage = await checkPageUnderMax(Comment, { author: req.params.user_id }, limit, req.params.p);
  const comments = await Comment.find({ author: req.params.user_id }).skip((req.params.p * limit) - limit)
  .limit(limit).lean().exec();
  if (comments.length <= 0) throw new CustomError(404, "You did not write any comments!");
  res.status(200).json({comments, maxPage, currentPage: req.params.p});
}));

//prettier-ignore
router.get("/:user_id/communities/page/:p", validatePage(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);
  const limit = 10;
  const maxPage = await checkPageUnderMax(CommunityMember, { member: req.params.user_id }, limit, req.params.p);
  const communityMembers = await CommunityMember.find({ member: req.params.user_id }).populate("community")
  .skip((req.params.p * limit) - limit).limit(limit).lean().exec();
  if (communityMembers.length <= 0) throw new CustomError(404, "You did not join any communitites!");
  const communities = communityMembers.map(communityMember => communityMember.community);
  res.status(200).json({communities, currentPage: req.params.p, maxPage});
}));

export default router;
