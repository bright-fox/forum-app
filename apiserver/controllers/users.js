import express from "express";
import { validationResult } from "express-validator";

import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";
import CommunityMember from "../models/communityMember";

import { validateCreateUser, validateUpdateUser } from "../middlewares/validation";
import { checkValidationErrors, asyncHandler } from "../util";
import CustomError from "../util/CustomError";

const router = express.Router();

//prettier-ignore
router.get("/", asyncHandler(async (req, res) => {
  const users = await User.find({}).lean().exec();
  res.status(200).json(users);
  })
);

//prettier-ignore
router.get("/:user_id", asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.user_id).lean().exec()
  if (!user) throw new CustomError(404, "No user found");
  res.status(200).json(user);
}));

//prettier-ignore
router.post("/", validateCreateUser(), asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  if (checkValidationErrors(req)) throw new CustomError(400);

  const user = new User({ username, email });
  const savedUser = await user.save();
  res.status(200).json(savedUser);
}));

//prettier-ignore
router.put("/:user_id", validateUpdateUser(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);

  const user = await User.findById(req.params.user_id).exec();
  const { username, email } = req.body;
  if (!user) throw new CustomError(404, "No user found to be updated");

  user.username = username || user.username;
  user.email = email || user.email;

  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
}));

//prettier-ignore
router.delete("/:user_id", asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.user_id).exec();
  if (!user) throw new CustomError(404, "No user found to be deleted");

  await user.remove();
  res.status(200).json(req.params.user_id);
}));

//prettier-ignore
router.get("/:user_id/home", asyncHandler(async (req, res) => {
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
