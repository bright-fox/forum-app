import express from "express";
import Post from "../models/Post";
import PostVote from "../models/postVote";

import { validatePost } from "../middlewares/validation";
import {
  checkCommunityMembership,
  authenticateIdToken,
  checkPostOwnership,
  checkPostVoteOwnership
} from "../middlewares/auth";
import { checkValidationErrors, asyncHandler } from "../util";
import CustomError from "../util/CustomError";

const router = express.Router();

//prettier-ignore
router.get("/", asyncHandler(async(req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 }).lean().exec();
  if(posts.length <= 0) throw new CustomError(404, "There are no posts yet!");
  res.status(200).json(posts);
}));

//prettier-ignore
router.post("/", authenticateIdToken, checkCommunityMembership, validatePost(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);
  const { title, content, community } = req.body;
  const { id } = req.user;
  const post = new Post({ title, content, community, author: id});
  const createdPost = await post.save();
  res.status(200).json(createdPost);
}));

//prettier-ignore
router.get("/:post_id", asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.post_id).lean().exec();
  if (!post) throw new CustomError(404, "No posts found");
  res.status(200).json(post);
}));

//prettier-ignore
router.put("/:post_id", authenticateIdToken, checkPostOwnership, validatePost(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);
  const { doc } = req;
  const { title, content } = req.body;
  
  doc.title = title;
  doc.content = content;

  await doc.save();
  res.status(200).json({ success: "You successfully updated your post" });
}));

//prettier-ignore
router.delete("/:post_id", authenticateIdToken, checkPostOwnership, asyncHandler(async (req, res) => {
  await req.doc.remove();
  res.status(200).json(req.params.post_id);
}));

//prettier-ignore
router.post("/:post_id/postvotes", authenticateIdToken, asyncHandler(async (req, res) => {
  const { vote } = req.body;
  const postVote = new PostVote({ vote, user: req.user.id, post: req.params.post_id });

  // check for existing vote of user and remove it
  const foundPostVote = await PostVote.findOne({ post: req.params.post_id, user: req.user.id }).exec();
  if (foundPostVote) await foundPostVote.remove();

  await postVote.save();
  res.status(200).json({success: "You successfully voted for post"});
}));

//prettier-ignore
router.delete("/:post_id/postvotes/:postVote_id", authenticateIdToken, checkPostVoteOwnership, asyncHandler(async (req, res) => {
  await req.doc.remove();
  res.status(200).json(req.params.postVote_id);
}));

export default router;
