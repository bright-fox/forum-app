import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";
import CommunityMember from "../models/communityMember";

import { validateUser, validatePassword } from "../middlewares/validation";
import { authenticateIdToken, checkUserOwnership } from "../middlewares/auth";
import { checkValidationErrors, asyncHandler } from "../util";
import CustomError from "../util/CustomError";

const router = express.Router();

// TODO: REMOVE PASSWORDS FROM RESPONSE with .select("-password")

//prettier-ignore
router.get("/", asyncHandler(async (req, res) => { // remove that route for production
  const users = await User.find({}).select("-_id -__v -email -password").lean().exec();
  res.status(200).json(users);
  })
);

//prettier-ignore
router.get("/:user_id", asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.user_id).select("-_id -__v -email -password").lean().exec();
  if (!user) throw new CustomError(404, "No user found");
  res.status(200).json(user);
}));

//prettier-ignore
router.put("/:user_id", authenticateIdToken, checkUserOwnership, 
  validateUser(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);

  const user = await User.findById(req.user.id).exec();
  const { username, biography } = req.body;
  if (!user) throw new CustomError(404, "No user found to be updated");

  user.username = username;
  user.biography = biography;
  await user.save();
  res.status(200).json({success: "You succesfully updated your profile!"});
}));

//prettier-ignore
router.put("/:user_id/password", authenticateIdToken, checkUserOwnership, 
  validatePassword(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);

  const user = await User.findById(req.user.id).exec();
  if (!user) throw new CustomError(404, "No user found to be updated");

  const { oldPassword, newPassword } = req.body;
  const passwordValid = await bcrypt.compare(oldPassword, user.password);
  if(!passwordValid) throw new CustomError(400, "Wrong password");

  user.password = newPassword;
  await user.save();
  res.status(200).json({success: "You succesfully updated your password!"});
}));

//prettier-ignore
router.delete("/:user_id", authenticateIdToken, checkUserOwnership, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.user_id).exec();
  if (!user) throw new CustomError(404, "No user found to be deleted");

  await user.remove();
  res.status(200).json(req.params.user_id);
}));

//prettier-ignore
router.get("/:user_id/private", authenticateIdToken, checkUserOwnership, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.user_id).select("-password").lean().exec();
  if (!user) throw new CustomError(404, "No user found");
  res.status(200).json(user);
}));

//prettier-ignore
router.get("/:user_id/home", authenticateIdToken, checkUserOwnership, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.user_id).exec();
  if (!user) throw new CustomError(404, "No user found");

  const posts = await Post.find({ community: { $in: user.communities }}).lean().exec();
  if (posts.length <= 0) throw new CustomError(404, "You did not join any communities!");
  res.status(200).json(posts);
}));

//prettier-ignore
router.get("/:user_id/posts", asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.params.user_id }).lean().exec();
  if (posts.length <= 0) throw new CustomError("You did not post any posts!");
  res.status(200).json(posts);
}));

//prettier-ignore
router.get("/:user_id/comments", asyncHandler(async(req, res) => {
  const comments = await Comment.find({ author: req.params.user_id }).lean().exec();
  if (comments.length <= 0) throw new CustomError(404, "You did not write any comments!");
  res.status(200).json(comments);
}));

//prettier-ignore
router.get("/:user_id/communities", asyncHandler(async (req, res) => {
  const communityMembers = await CommunityMember.find({ member: req.params.user_id }).populate("community")
    .lean().exec();
  if (communityMembers.length <= 0) throw new CustomError(404, "You did not join any communitites");
  const communities = communityMembers.map(communityMember => communityMember.community);
  res.status(200).json(communities);
}));

export default router;
